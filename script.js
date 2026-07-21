  /*
    Nada de foto ou texto fica "duro" no código.
    - content/site.json  -> título, subtítulo, rodapé
    - content/fotos.json -> lista de fotos, categoria, legenda e ordem
    Tudo isso é editado pelo painel em /admin, sem precisar mexer aqui.
  */
  const nomes = {
    artistico: "Artístico",
    gestante: "Gestante",
    casal: "Casal",
    profissional: "Profissional"
  };
 
  const galeria = document.getElementById("galeria");
  const contador = document.getElementById("contador");
  let fotos = [];
 
  async function carregarTextos(){
    try{
      const resposta = await fetch("content/site.json");
      const dados = await resposta.json();
      if(dados.titulo) document.getElementById("titulo-site").textContent = dados.titulo;
      if(dados.subtitulo) document.getElementById("subtitulo-site").textContent = dados.subtitulo;
      if(dados.rodape) document.getElementById("rodape-site").textContent = dados.rodape;
      if(dados.titulo) document.title = `${dados.titulo} — Fotografia`;
    }catch(erro){
      console.error("Não foi possível carregar content/site.json", erro);
    }
  }
 
  async function carregarFotos(){
    try{
      const resposta = await fetch("content/fotos.json");
      const dados = await resposta.json();
      fotos = dados.fotos || [];
    }catch(erro){
      console.error("Não foi possível carregar content/fotos.json", erro);
      fotos = [];
    }
  }
 
  function renderizar(){
    galeria.innerHTML = "";
    fotos.forEach(foto => {
      const div = document.createElement("div");
      div.className = "foto";
      div.dataset.categoria = foto.categoria;
      const textoLegenda = foto.legenda && foto.legenda.trim() ? foto.legenda : nomes[foto.categoria];
      div.innerHTML = `
        <img src="${foto.imagem}" alt="${textoLegenda}" loading="lazy">
        <span class="legenda">${textoLegenda}</span>
      `;
      galeria.appendChild(div);
    });
    contador.textContent = `Mostrando ${fotos.length} fotos`;
  }
 
  function filtrar(categoria){
    const itens = document.querySelectorAll(".foto");
    let visiveis = 0;
    itens.forEach(item => {
      const mostra = categoria === "todos" || item.dataset.categoria === categoria;
      item.classList.toggle("escondida", !mostra);
      if(mostra) visiveis++;
    });
    contador.textContent = `Mostrando ${visiveis} foto${visiveis !== 1 ? "s" : ""}`;
  }
 
  document.querySelectorAll(".filtros button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filtros button").forEach(b => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      filtrar(btn.dataset.filtro);
    });
  });
 
  (async function iniciar(){
    await carregarTextos();
    await carregarFotos();
    renderizar();
  })();