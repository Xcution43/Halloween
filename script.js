// ---------------- Arcade Start ----------------
function startGame() {
  window.location.href = 'main.html';
}

// ---------------- Invite Page ----------------
function initNeonCircuit(){
  const canvas = document.getElementById('neonCanvas');
  if(!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const nodes = [];
  const nodeCount = 80;
  const maxDistance = 150;

  for(let i=0;i<nodeCount;i++){
    nodes.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      vx: (Math.random()-0.5)*0.5,
      vy: (Math.random()-0.5)*0.5,
      r: 2+Math.random()*2
    });
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<nodeCount;i++){
      const a = nodes[i];
      for(let j=i+1;j<nodeCount;j++){
        const b = nodes[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist=Math.sqrt(dx*dx + dy*dy);
        if(dist<maxDistance){
          ctx.strokeStyle=`rgba(0,255,255,${1-dist/maxDistance})`;
          ctx.lineWidth=1;
          ctx.shadowColor='#0ff';
          ctx.shadowBlur=4;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    for(const n of nodes){
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>canvas.width) n.vx*=-1;
      if(n.y<0||n.y>canvas.height) n.vy*=-1;

      ctx.fillStyle='#0ff';
      ctx.shadowColor='#0ff';
      ctx.shadowBlur=6;
      ctx.beginPath();
      ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ---------------- Typing Effects ----------------
function typeTextEffect(spanElement, text, speed=80){
  let index=0;
  function type(){
    if(index < text.length){
      spanElement.innerText += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }
  type();
}

// ---------------- Main Page Dialog ----------------
function startDialog(){
  const bubble1 = document.getElementById('bubble1'); // Ralph
  const bubble2 = document.getElementById('bubble2'); // Vanellope
  const btn = document.getElementById('letsGoBtn');

  if(!bubble1 || !bubble2) return;

  const dialog=[
    {speaker:'vanellope', text:"Can I go to the Halloween Party at Tim and Anu's place?"},
    {speaker:'ralph', text:"I don't know. Can you be annoyingly good looking?"},
    {speaker:'vanellope', text:"I don't know. Can I? Can I? Can I? Can I? Can I? Can I? Can I?"},
    {speaker:'ralph', text:"Okay!!! Just don't forget to be there at 8pm and remember, the costume is mandatory!!!"}
  ];

  let step=0, typing=false;

  function typeWriter(text, element, callback){
    let i=0; element.innerText='';
    typing=true;

    function type(){
      if(i<text.length){
        element.innerText+=text.charAt(i);
        i++;
        setTimeout(type, 40);
      } else {
        typing=false;
        if(callback) callback();
      }
    }
    type();
  }

  typeWriter(dialog[0].text, bubble2);

document.body.addEventListener('click', ()=>{
  if(typing) return;
  step++;
  if(step >= dialog.length){
    btn.style.display = 'block'; // show button only after dialog
    return;
  }
  const current = dialog[step];
  typeWriter(current.text, current.speaker === 'ralph' ? bubble1 : bubble2);
});
}

// ---------------- DOMContentLoaded ----------------
document.addEventListener('DOMContentLoaded', ()=>{
  if(document.body.classList.contains('invite-page')){
    initNeonCircuit();
    const typeSpan=document.getElementById('typeText');
    if(typeSpan) typeTextEffect(typeSpan, "LETS WRECK-IT!", 80);
  }

  if(document.body.classList.contains('main-page')){
    startDialog();
  }
});
