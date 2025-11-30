import React, { useEffect, useRef, useState } from 'react';

export default function Main(){
  const [todos,setTodos] = useState(()=> JSON.parse(localStorage.getItem('todos')||'[]'));
  const [text,setText] = useState('');
  const [notif,setNotif] = useState(null);
  const tRef = useRef();

  useEffect(()=> localStorage.setItem('todos', JSON.stringify(todos)), [todos]);
  useEffect(()=> () => clearTimeout(tRef.current), []);

  const notify = (msg, ms=2200) => { clearTimeout(tRef.current); setNotif(msg); tRef.current = setTimeout(()=>setNotif(null), ms); };
  const add = () => { const v = text.trim(); if(!v){ notify('متن وارد نشده'); return } setTodos(s=>([{ id:Date.now(), text:v }, ...s])); setText(''); notify('کار اضافه شد ✅'); };
  const del  = (id, txt) => { setTodos(s=>s.filter(x=>x.id!==id)); notify(`آیتم «${txt}» حذف شد`); };
  const clearAll = () => { if(!todos.length){ notify('آیتمی وجود ندارد'); return } if(window.confirm('آیا حذف همه؟')){ setTodos([]); notify('همه حذف شدند 🗑️') } };

  const S = {
   
    page:  { position:'fixed', inset:0, boxSizing:'border-box', fontFamily:"Tahoma, Arial", background:'linear-gradient(180deg,#0e5759,#6bffe1)', direction:'rtl', display:'flex', justifyContent:'center', alignItems:'flex-start', overflowY:'auto', padding:24 },
    box:   { width:'100%', maxWidth:760, background:'rgba(255,255,255,0.95)', borderRadius:14, padding:16, boxShadow:'0 10px 30px rgba(0,0,0,0.12)' },
    row:   { display:'flex', gap:10, alignItems:'center' },
    in:    { flex:1, padding:12, borderRadius:10, border:'1px solid rgba(0,0,0,0.06)', outline:'none' },
    add:   { width:48, height:48, borderRadius:10, border:'none', fontSize:22, color:'#fff', background:'linear-gradient(135deg,#08a39f,#2ce9d6)', cursor:'pointer' },
    item:  { display:'flex', justifyContent:'space-between', alignItems:'center', padding:12, marginTop:12, borderRadius:10, background:'#fff', boxShadow:'0 6px 18px rgba(0,0,0,0.06)' },
    del:   { border:'none', background:'transparent', color:'#d23b3b', cursor:'pointer' },
    bottom:{ position:'fixed', left:0, right:0, bottom:0, height:76, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.98)', boxShadow:'0 -8px 30px rgba(0,0,0,0.08)' },
    clear: { padding:'10px 14px', borderRadius:12, border:'none', background:'#ff6b6b', color:'#fff', cursor:'pointer' },
    notif: { position:'fixed', top:18, left:'50%', transform:'translateX(-50%)', padding:'8px 12px', borderRadius:10, background:'#06b6d4', color:'#fff', boxShadow:'0 8px 20px rgba(0,0,0,0.15)' }
  };

  return (
    <div style={S.page}>
      {notif && <div style={S.notif} role="status">{notif}</div>}

      <div style={S.box}>
        <div style={S.row}>
          <input
            style={S.in}
            value={text}
            onChange={e=>setText(e.target.value)}
            onKeyDown={e=>e.key==='Enter' && add()}
            placeholder="کاری برای انجام اضافه کنید..."
            aria-label="جدید"
          />
          <button style={S.add} onClick={add} aria-label="اضافه">+</button>
        </div>

        <div>
          {todos.length===0
            ? <div style={{textAlign:'center', marginTop:18, color:'rgba(0,0,0,0.6)'}}>آیتمی وجود ندارد — یک کار اضافه کن.</div>
            : todos.map(t=>(
                <div key={t.id} style={S.item}>
                  <div style={{flex:1, marginRight:8}}>{t.text}</div>
                  <button style={S.del} onClick={()=>del(t.id, t.text)}>حذف</button>
                </div>
            ))
          }
        </div>
      </div>

      <div style={S.bottom}>
        <div style={{width:'100%', maxWidth:760, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 16px'}}>
          <div>تعداد کل: <strong>{todos.length}</strong></div>
          <button style={S.clear} onClick={clearAll}>حذف</button>
        </div>
      </div>
    </div>
  );
}
