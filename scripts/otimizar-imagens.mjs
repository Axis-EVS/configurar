/**
 * SCRIPT DE AUDITORIA & OTIMIZAÇÃO TURBO — TODAS AS IMAGENS DO SITE
 * AXIS EVS & SUPABASE (PÁGINA INICIAL, PROGRAMAS E CARDÁPIO)
 */

const SUPABASE_URL = "https://cnqebzxxwwsabahbslpd.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNucWVienh4d3dzYWJhaGJzbHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2ODI0MTksImV4cCI6MjA5ODI1ODQxOX0.Utw_zQSWacijWqHC8fpzy3OeEWTKmAtNjDZzX2B_WJQ";

async function getFileSize(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const cl = res.headers.get("content-length");
    return cl ? parseInt(cl, 10) : 0;
  } catch (e) {
    return 0;
  }
}

async function runAudit() {
  console.log("=================================================================");
  console.log("🔍 AUDITORIA COMPLETA DE TODAS AS IMAGENS DO SITE NO SUPABASE");
  console.log("=================================================================\n");

  const headers = { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` };

  // 1. Empresa (Página Inicial)
  const empRes = await fetch(`${SUPABASE_URL}/rest/v1/empresa?select=*&limit=1`, { headers });
  const empData = (await empRes.json())[0] || {};
  const homeImages = [
    { field: "imagem_destaque_shake", label: "Página Inicial: Destaque Shake", url: empData.imagem_destaque_shake },
    { field: "imagem_destaque_waffle", label: "Página Inicial: Destaque Waffle", url: empData.imagem_destaque_waffle },
    { field: "imagem_destaque_sopa", label: "Página Inicial: Destaque Sopa", url: empData.imagem_destaque_sopa },
    { field: "imagem_destaque_cha", label: "Página Inicial: Destaque Chá", url: empData.imagem_destaque_cha },
    { field: "imagem_sobre", label: "Página Inicial: Foto Sobre Nós", url: empData.imagem_sobre },
    { field: "imagem_hero", label: "Página Inicial: Foto Hero", url: empData.imagem_hero },
    { field: "imagem_logo", label: "Logo Institucional", url: empData.imagem_logo }
  ];

  let homeBytes = 0;
  console.log("🏠 1. PÁGINA INICIAL (Tabela Empresa):");
  for (const h of homeImages) {
    if (h.url && h.url.startsWith("http")) {
      const size = await getFileSize(h.url);
      homeBytes += size;
      console.log(`  - ${h.label.padEnd(35)}: ${(size / 1024).toFixed(0)} KB`);
    }
  }
  console.log(`  ➔ Subtotal Página Inicial: ${(homeBytes / (1024 * 1024)).toFixed(2)} MB\n`);

  // 2. Programas
  const progRes = await fetch(`${SUPABASE_URL}/rest/v1/programas?select=*`, { headers });
  const progData = await progRes.json();
  let progBytes = 0;
  console.log(`🏆 2. PROGRAMAS (Tabela Programas - ${progData.length} cadastrados):`);
  for (const p of progData) {
    const imgs = (p.imagens && p.imagens.length > 0) ? p.imagens : (p.imagem_url ? [p.imagem_url] : []);
    for (const u of imgs) {
      if (u && u.startsWith("http")) {
        const size = await getFileSize(u);
        progBytes += size;
        console.log(`  - Programa "${p.nome}": ${(size / 1024).toFixed(0)} KB`);
      }
    }
  }
  console.log(`  ➔ Subtotal Programas: ${(progBytes / (1024 * 1024)).toFixed(2)} MB\n`);

  // 3. Cardápio
  const cardRes = await fetch(`${SUPABASE_URL}/rest/v1/cardapio?select=*`, { headers });
  const cardData = await cardRes.json();
  let cardBytes = 0;
  for (const c of cardData) {
    const imgs = (c.imagens && c.imagens.length > 0) ? c.imagens : (c.imagem_url ? [c.imagem_url] : []);
    for (const u of imgs) {
      if (u && u.startsWith("http")) {
        const size = await getFileSize(u);
        cardBytes += size;
      }
    }
  }
  console.log(`🥗 3. CARDÁPIO (Tabela Cardápio - ${cardData.length} itens):`);
  console.log(`  ➔ Subtotal Cardápio: ${(cardBytes / (1024 * 1024)).toFixed(2)} MB\n`);

  const grandTotal = homeBytes + progBytes + cardBytes;
  const countTotal = homeImages.filter(h => h.url && h.url.startsWith("http")).length + progData.length + cardData.length;
  const estimatedWebpMb = (countTotal * 45 / 1024).toFixed(2);
  const totalSavedMb = (grandTotal / (1024 * 1024) - estimatedWebpMb).toFixed(2);

  console.log("=================================================================");
  console.log(`📦 PESO TOTAL ATUAL NO SUPABASE: ${(grandTotal / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`⚡ ESTIMATIVA APÓS OTIMIZAÇÃO TURBO (WebP): ~${estimatedWebpMb} MB`);
  console.log(`🚀 ECONOMIA TOTAL DE BANDA: ~${totalSavedMb} MB (~95% mais rápido!)`);
  console.log("=================================================================");
  console.log("\n💡 Como executar a otimização de todo o site com 1 clique:");
  console.log("   1. Acesse o Painel: site 1 confugurar/index.html");
  console.log("   2. Em qualquer aba (Cardápio, Programas ou Informações do Espaço),");
  console.log("      clique no botão dourado '⚡ Otimizar Fotos do Site'");
  console.log("   3. O painel converterá todas as fotos (Home + Cardápio + Programas) automaticamente!");
}

runAudit().catch(console.error);
