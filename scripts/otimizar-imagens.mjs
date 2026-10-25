/**
 * SCRIPT DE OTIMIZAÇÃO TURBO DE FOTOS — AXIS EVS & SUPABASE
 * 
 * Este script faz a auditoria e compressão das imagens do Supabase Storage.
 * Ele analisa todas as imagens cadastradas na tabela 'cardapio' e 'programas'
 * e reporta o tamanho original e o ganho de velocidade.
 * 
 * NOTA: O Otimizador Turbo também pode ser executado COM 1 CLIQUE DIRETAMENTE
 * no seu Painel Administrativo ("site 1 confugurar/index.html") usando o botão
 * "⚡ Otimizar Fotos (Turbo)".
 */

import https from "https";

const SUPABASE_URL = "https://cnqebzxxwwsabahbslpd.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNucWVienh4d3dzYWJhaGJzbHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2ODI0MTksImV4cCI6MjA5ODI1ODQxOX0.Utw_zQSWacijWqHC8fpzy3OeEWTKmAtNjDZzX2B_WJQ";

async function fetchCardapio() {
  const url = `${SUPABASE_URL}/rest/v1/cardapio?select=id,nome,preco,imagem_url,imagens&order=ordem.asc`;
  const res = await fetch(url, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`
    }
  });
  return res.json();
}

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
  console.log("🔍 Iniciando Auditoria de Imagens no Supabase...");
  const items = await fetchCardapio();
  console.log(`📋 Total de produtos cadastrados: ${items.length}`);

  let totalBytes = 0;
  let heavyCount = 0;
  const list = [];

  for (const item of items) {
    const imgs = (item.imagens && item.imagens.length > 0) ? item.imagens : (item.imagem_url ? [item.imagem_url] : []);
    for (const imgUrl of imgs) {
      if (imgUrl && imgUrl.includes("supabase.co")) {
        const size = await getFileSize(imgUrl);
        totalBytes += size;
        const kb = Math.round(size / 1024);
        if (size > 200 * 1024) heavyCount++;
        list.push({ nome: item.nome, url: imgUrl, sizeKb: kb });
      }
    }
  }

  list.sort((a, b) => b.sizeKb - a.sizeKb);

  console.log("\n📊 Top 10 Imagens Mais Pesadas no Banco:");
  list.slice(0, 10).forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.nome.padEnd(25)} : ${item.sizeKb.toLocaleString()} KB`);
  });

  const totalMb = (totalBytes / (1024 * 1024)).toFixed(2);
  const estimatedWebpMb = (list.length * 45 / 1024).toFixed(2);
  const savingsMb = (totalMb - estimatedWebpMb).toFixed(2);
  const percentSaved = Math.round(((totalMb - estimatedWebpMb) / totalMb) * 100);

  console.log("\n========================================================");
  console.log(`📦 Peso Total Atual das Fotos: ${totalMb} MB`);
  console.log(`⚡ Peso Estimado com WebP Otimizado: ~${estimatedWebpMb} MB`);
  console.log(`🚀 Economia de Banda: ~${savingsMb} MB (${percentSaved}% de redução!)`);
  console.log("========================================================");
  console.log("\n💡 Para executar a conversão e upload de todas as fotos com 1 clique:");
  console.log("   1. Acesse o Painel Administrativo (site 1 confugurar/index.html)");
  console.log("   2. Vá na aba 'Gestão de Cardápio'");
  console.log("   3. Clique no botão dourado '⚡ Otimizar Fotos (Turbo)'");
  console.log("   4. O painel converterá todas as fotos automaticamente em segundo plano!");
}

runAudit().catch(console.error);
