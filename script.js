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
function startDialog() {
  const bubble1 = document.getElementById('bubble1'); // Ralph
  const bubble2 = document.getElementById('bubble2'); // Vanellope
  const btn = document.getElementById('letsGoBtn');

  if (!bubble1 || !bubble2) return;

  const dialog = [
    { speaker: 'vanellope', text: "Can I go to the Halloween Party at Tim and Anu's place?" },
    { speaker: 'ralph', text: "I don't know. Can you be annoyingly good looking?" },
    { speaker: 'vanellope', text: "I don't know. Can I? Can I? Can I? Can I? Can I? Can I? Can I?" },
    { speaker: 'ralph', text: "Okay!!! Just don't forget to be there at 8pm and remember, the costume is mandatory!!!" }
  ];

  let step = 0;
  let typing = false;

  function typeWriter(text, element, callback) {
    let i = 0;
    element.innerText = '';
    typing = true;

    // Reset bubble width to auto before typing
    element.style.width = 'auto';

    function type() {
      if (i < text.length) {
        element.innerText += text.charAt(i);
        i++;

        // Dynamically adjust width while typing
        const computedWidth = element.scrollWidth + 20; // add padding
        const maxWidth = window.innerWidth * 0.9;
        const minWidth = 120;
        element.style.width = Math.min(Math.max(computedWidth, minWidth), maxWidth) + 'px';

        setTimeout(type, 40);
      } else {
        typing = false;
        if (callback) callback();
      }
    }
    type();
  }

  // Update bubble position above character
function updateBubblePosition(speaker) {
  const bubble = speaker === 'ralph' ? document.getElementById('bubble1') : document.getElementById('bubble2');
  const img = speaker === 'ralph' ? document.querySelector('.ralph1 img') : document.querySelector('.vanellope img');
  const imgRect = img.getBoundingClientRect();

  let newTop = window.scrollY + imgRect.top - bubble.offsetHeight - 10;

  // Keep bubble from going above top of viewport
  const minTop = 10; // minimum 10px from top
  if (newTop < minTop) newTop = minTop;

  bubble.style.top = newTop + 'px';
  bubble.style.transition = 'top 0.3s ease'; // smooth movement
}

  // Start first dialog
  typeWriter(dialog[0].text, bubble2, () => {
    updateBubblePosition('vanellope');
  });

  document.body.addEventListener('click', () => {
    if (typing) return;
    step++;
    if (step >= dialog.length) {
      btn.style.display = 'block';
      document.querySelector('.ralph1 img').classList.remove('speaking');
      document.querySelector('.vanellope img').classList.remove('speaking');
      return;
    }

    const current = dialog[step];

    // Add speaking animation
    if (current.speaker === 'ralph') {
      document.querySelector('.ralph1 img').classList.add('speaking');
      document.querySelector('.vanellope img').classList.remove('speaking');
    } else {
      document.querySelector('.vanellope img').classList.add('speaking');
      document.querySelector('.ralph1 img').classList.remove('speaking');
    }

    // Type dialog and reposition bubble
    typeWriter(current.text, current.speaker === 'ralph' ? bubble1 : bubble2, () => {
      updateBubblePosition(current.speaker);
    });
  });

  // Reposition bubbles on window resize
  window.addEventListener('resize', () => {
    updateBubblePosition('ralph');
    updateBubblePosition('vanellope');
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
