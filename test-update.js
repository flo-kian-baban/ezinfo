fetch("http://localhost:3000/api/ezinfo/touchpoint/update", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    slug: "chicos",
    email: "kian@flo.dev",
    patch: { loyalty_offer_enabled: true }
  })
}).then(res => res.json()).then(console.log).catch(console.error);
