// Roda depois do script do roteiro: adapta o conteúdo interativo para papel e monta o sumário.
// window.__PAGINAS é null na 1ª passada (só marcadores) e traz {id: página} na 2ª.
(function(){
  var P=window.__PAGINAS;
  var pg=function(id){return P&&P[id]?String(P[id]):'00';};
  function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}

  document.documentElement.setAttribute('data-theme','light');
  document.body.removeAttribute('data-mode');

  // Só do professor ou só da versão web
  document.querySelectorAll('.note.say,.copy,.modes-wrap,.mtoc').forEach(function(e){e.remove();});

  // "Etapa concluída" vira um quadrado para marcar a caneta
  document.querySelectorAll('.done-row').forEach(function(r){
    r.innerHTML='<span class="feito"><span class="box"></span>Etapa concluída em ____/____</span>';
  });
  // Botões dos passos viram números
  document.querySelectorAll('.steps>li>.sn').forEach(function(b){var s=el('span','sn');b.replaceWith(s);});
  // Checklist: caixa desenhada no lugar do input
  document.querySelectorAll('.checks label').forEach(function(l){
    var i=l.querySelector('input');if(i)i.replaceWith(el('span','box'));
  });

  // "Passo a passo manual" nunca fica sozinho no pé da página: agrupa com o bloco seguinte
  // (e, se esse bloco for um título, com o primeiro item depois dele)
  document.querySelectorAll('.manual-h').forEach(function(h){
    var g=el('div','junto');h.before(g);g.appendChild(h);
    var n=g.nextElementSibling;
    if(n&&n.matches('h3')){g.appendChild(n);n=g.nextElementSibling;
      if(n&&n.matches('ol.steps')&&n.children.length>1){var ol=n.cloneNode(false);ol.appendChild(n.firstElementChild);g.appendChild(ol);ol.dataset.parte='1';n.style.counterReset='st 1';}
    }else if(n&&!n.matches('ol.steps')){g.appendChild(n);}
  });

  // Marcadores de página (lidos pelo gerador na 1ª passada)
  function marca(alvo,id){var m=el('span','pg-mark',P?'':'⟦'+id+'⟧');alvo.prepend(m);}
  var secoes=[].slice.call(document.querySelectorAll('section.stage'));
  secoes.forEach(function(s){
    marca(s.querySelector('.stage-head'),s.id);
    s.querySelectorAll('h3.sub').forEach(function(h,i){
      var k=h.querySelector('.k');var id=s.id+'-'+(k?k.textContent.trim():i);h.dataset.id=id;
      if(!h.id)h.id=id;marca(h,id);
    });
  });

  // Cabeçalho corrido: uma página nomeada por etapa
  var css='';
  secoes.forEach(function(s){
    var num=s.querySelector('.stage-num').textContent.trim();
    var rot=(num==='A'?'Apêndice':'Etapa '+num)+' · '+s.dataset.title;
    css+='@page '+s.id+'{@top-right{content:"'+rot.replace(/"/g,'\\"')+'"}}\n#'+s.id+'{page:'+s.id+'}\n';
  });
  document.head.appendChild(el('style',null,css));

  // Número da página nos cartões do mapa das etapas
  document.querySelectorAll('.road a').forEach(function(a){
    var rn=a.querySelector('.rn');if(rn)rn.appendChild(el('span','rn-pg','p. '+pg(a.dataset.sec)));
  });

  // Sumário
  var sum=document.querySelector('[data-sumario]');
  var cores={'Começo':'geral','Bubble':'bubble','Integrações':'make','Fechamento':'sheets'};
  var grupo='',bloco;
  secoes.forEach(function(s){
    var g=s.dataset.group;
    if(g!==grupo){
      grupo=g;bloco=el('div','sm-grupo g-'+(cores[g]||'geral'));
      bloco.appendChild(el('div','sm-gt',g));sum.appendChild(bloco);
    }
    var num=s.querySelector('.stage-num').textContent.trim();
    var h2=s.querySelector('h2').innerHTML;
    var e=el('a','sm-etapa');e.href='#'+s.id;
    e.innerHTML='<span class="sm-n">'+num+'</span><span class="sm-t">'+h2+'<small>'+s.dataset.title+'</small></span><span class="sm-p">'+pg(s.id)+'</span>';
    bloco.appendChild(e);
    var subs=s.querySelectorAll('h3.sub');
    if(subs.length){
      var ul=el('div','sm-subs');
      subs.forEach(function(h){
        var k=h.querySelector('.k');var t=h.cloneNode(true);t.querySelectorAll('.k,.pg-mark').forEach(function(x){x.remove();});
        var a=el('a','sm-sub');a.href='#'+h.id;
        a.innerHTML='<span class="sm-k">'+(k?k.textContent:'')+'</span><span class="sm-st">'+t.innerHTML+'</span><span class="sm-p">'+pg(h.dataset.id)+'</span>';
        ul.appendChild(a);
      });
      bloco.appendChild(ul);
    }
  });

  // Página de anotações no fim
  var an=el('section','pre anotacoes');an.id='anotacoes';
  an.innerHTML='<div class="pre-eyebrow">Seu caderno</div><h2 class="pre-h">Anotações</h2><p class="pre-lead">URL do seu app, nome do cenário, dúvidas para levar à aula. A URL do webhook e a chave da API não: essas ficam só no <code>comandos.txt</code>.</p><div class="linhas"></div>';
  document.querySelector('main.miolo').appendChild(an);
})();
