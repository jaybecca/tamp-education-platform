const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const MAX_IMAGE = 15 * 1024 * 1024;
const MAX_VIDEO = 30 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];

function json(data, status=200) { return new Response(JSON.stringify(data), {status, headers:JSON_HEADERS}); }
function safeName(name) { return String(name || "upload").normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(-90) || "upload"; }
function authorized(request, env) { return Boolean(env.EVENTS_ADMIN_PASSWORD) && request.headers.get("x-admin-password") === env.EVENTS_ADMIN_PASSWORD; }

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      if (request.method === "OPTIONS") return new Response(null, {status:204, headers:{"access-control-allow-origin":url.origin,"access-control-allow-methods":"GET,POST,PUT,DELETE,OPTIONS","access-control-allow-headers":"content-type,x-admin-password"}});
      if (url.pathname === "/api/events" && request.method === "GET") {
        const item = await env.EVENTS_MEDIA.get("campaign/current.json");
        if (!item) return json({published:false});
        try { return json({published:true,event:await item.json()}); } catch { return json({error:"Campaign data is unavailable."},500); }
      }
      if (url.pathname.startsWith("/api/media/") && request.method === "GET") {
        const key = decodeURIComponent(url.pathname.slice("/api/media/".length));
        if (!key || key.includes("..") || key.startsWith("/")) return json({error:"Invalid media path."},400);
        const object = await env.EVENTS_MEDIA.get("media/" + key);
        if (!object) return new Response("Not found", {status:404});
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        headers.set("cache-control","public, max-age=31536000, immutable");
        return new Response(object.body,{headers});
      }
      if (url.pathname === "/api/admin/login" && request.method === "POST") {
        if (!env.EVENTS_ADMIN_PASSWORD) return json({error:"Admin password is not configured yet. Set EVENTS_ADMIN_PASSWORD in Cloudflare Worker secrets."},503);
        let body={}; try { body=await request.json(); } catch {}
        return body.password === env.EVENTS_ADMIN_PASSWORD ? json({ok:true}) : json({error:"Incorrect password."},401);
      }
      if (!authorized(request,env)) return json({error:"Admin access required."},401);
      if (url.pathname === "/api/admin/events" && request.method === "GET") {
        const item=await env.EVENTS_MEDIA.get("campaign/current.json");
        return item ? json({event:await item.json()}) : json({event:null});
      }
      if (url.pathname === "/api/admin/events" && request.method === "PUT") {
        let event; try { event=await request.json(); } catch { return json({error:"Invalid campaign data."},400); }
        const clean = {
          title:String(event.title||"").trim().slice(0,100), eyebrow:String(event.eyebrow||"").trim().slice(0,70),
          description:String(event.description||"").trim().slice(0,1800), dates:String(event.dates||"").trim().slice(0,100),
          location:String(event.location||"").trim().slice(0,140), fee:String(event.fee||"").trim().slice(0,80),
          activities:String(event.activities||"").trim().slice(0,500), ctaText:String(event.ctaText||"Register / Enquire").trim().slice(0,45),
          whatsapp:String(event.whatsapp||"2347062581727").replace(/\D/g,"").slice(0,15),
          images:Array.isArray(event.images)?event.images.filter(x=>typeof x==="string" && /^[-a-zA-Z0-9._]+$/.test(x)).slice(0,12):[],
          video:typeof event.video==="string" && /^[-a-zA-Z0-9._]+$/.test(event.video)?event.video:"",
          updatedAt:new Date().toISOString()
        };
        if (!clean.title || !clean.description) return json({error:"Add an event title and description."},400);
        await env.EVENTS_MEDIA.put("campaign/current.json",JSON.stringify(clean),{httpMetadata:{contentType:"application/json"}});
        return json({ok:true,event:clean});
      }
      if (url.pathname === "/api/admin/upload" && request.method === "POST") {
        const form=await request.formData(); const file=form.get("file"); const kind=form.get("kind");
        if (!(file instanceof File)) return json({error:"Choose a file to upload."},400);
        const isImage=kind==="image" && IMAGE_TYPES.includes(file.type) && file.size<=MAX_IMAGE;
        const isVideo=kind==="video" && VIDEO_TYPES.includes(file.type) && file.size<=MAX_VIDEO;
        if (!isImage && !isVideo) return json({error:"Images: JPG, PNG or WebP up to 15MB. Video: MP4 or WebM up to 30MB."},400);
        const key=crypto.randomUUID()+"-"+safeName(file.name);
        await env.EVENTS_MEDIA.put("media/"+key,file.stream(),{httpMetadata:{contentType:file.type,cacheControl:"public, max-age=31536000, immutable"}});
        return json({ok:true,key,url:"/api/media/"+encodeURIComponent(key),kind});
      }
      return json({error:"API route not found."},404);
    }
    return env.ASSETS.fetch(request);
  }
};