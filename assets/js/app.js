/* ===== Data simulasi (mengikuti struktur tabel magang & laporan pada SRS) ===== */
const MHS = [
 {id:1,nim:"25091397101",nama:"Aulia Rahma",prodi:"D4 Manajemen Informatika",tempat:"PT Telkom Indonesia",
  laporan:[[1,"2026-02-02","Orientasi perusahaan","disetujui"],[1,"2026-02-03","Instalasi tools kerja","disetujui"],[1,"2026-02-04","Membaca dokumentasi sistem","disetujui"],
           [2,"2026-02-09","Membuat query laporan","disetujui"],[2,"2026-02-10","Revisi dashboard","disetujui"],[2,"2026-02-11","Uji coba fitur filter","menunggu"]]},
 {id:2,nim:"25091397102",nama:"Bagas Pratama",prodi:"D4 Manajemen Informatika",tempat:"Bank Jatim",
  laporan:[[1,"2026-02-02","Pengenalan alur kerja","divalidasi"],[1,"2026-02-03","Input data nasabah","divalidasi"],
           [2,"2026-02-09","Rekap transaksi harian","disetujui"],[2,"2026-02-10","Perbaikan format laporan","disetujui"]]},
 {id:3,nim:"25091397103",nama:"Citra Lestari",prodi:"D4 Manajemen Informatika",tempat:"CV Digital Nusantara",
  laporan:[[1,"2026-02-02","Setup repository","disetujui"],[1,"2026-02-03","Membuat halaman login","ditolak"],
           [2,"2026-02-09","Perbaikan halaman login","menunggu"]]},
 {id:4,nim:"25091397104",nama:"Dimas Saputra",prodi:"D4 Manajemen Informatika",tempat:"PT Pelindo",
  laporan:[[1,"2026-02-02","Observasi sistem logistik","disetujui"],[1,"2026-02-03","Analisis kebutuhan","disetujui"]]}
].map(m => ({...m, laporan:m.laporan.map(r=>({m:r[0],t:r[1],j:r[2],s:r[3]}))}));

const badge = s => `<span class="badge s-${s}">${s}</span>`;
const fmt = d => new Date(d).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});

/* ===== Dashboard ===== */
function queue(){ const q=[]; MHS.forEach(m=>[...new Set(m.laporan.map(r=>r.m))].forEach(w=>{ if(m.laporan.filter(r=>r.m===w).every(r=>r.s==="disetujui")) q.push({m,w}); })); return q; }
function renderQueue(){
  const q=queue();
  $("#heroSummary").text(q.length?`${q.length} laporan mingguan siap kamu validasi. Semua laporan di minggu itu sudah disetujui pembimbing magang.`:"Semua laporan mingguan sudah divalidasi.");
  $("#queue").html(q.length?q.map(x=>`<li><span><b>${x.m.nama}</b><small>Minggu ke-${x.w} · ${x.m.tempat}</small></span><button class="btn btn-primary btn-sm q-val" data-id="${x.m.id}" data-w="${x.w}">Validasi</button></li>`).join(""):'<li class="empty">Tidak ada antrean validasi.</li>');
}
$(document).on("click",".q-val",function(){ const m=MHS.find(x=>x.id==$(this).data("id")), w=+$(this).data("w"); m.laporan.filter(r=>r.m===w).forEach(r=>r.s="divalidasi"); renderHome(); });
function renderHome(){ renderQueue();
  const all = MHS.flatMap(m => m.laporan.map(r => ({...r, nama:m.nama})));
  const cards = [[MHS.length,"Mahasiswa dibimbing"],[all.length,"Laporan masuk"],
                 [queue().length,"Minggu siap divalidasi"],[MHS.length,"Belum dinilai"]];
  $("#statCards").html(cards.map(c=>`<div class="card"><b>${c[0]}</b><span>${c[1]}</span></div>`).join(""));
  $("#recentBody").html(all.filter(r=>r.s==="disetujui"||r.s==="divalidasi")
    .sort((a,b)=>b.t.localeCompare(a.t)).slice(0,5)
    .map(r=>`<tr><td>${r.nama}</td><td>${r.j}</td><td>${fmt(r.t)}</td><td>${badge(r.s)}</td></tr>`).join(""));
}

/* ===== Navigasi AJAX ===== */
function setActive(p){ $(".nav-link").removeClass("active").filter(`[data-page="${p}"]`).addClass("active"); $("#nav").removeClass("open"); $("#menuBtn").attr("aria-expanded","false"); }
function loadPage(p){
  setActive(p);
  if(p==="home"){ $("#content").prop("hidden",true).empty(); $("#home").prop("hidden",false); renderHome(); return; }
  $("#home").prop("hidden",true);
  $("#content").prop("hidden",false).html('<p class="loading">Memuat halaman…</p>')
    .load(`pages/${p}.html`, function(_, status){
      if(status==="error"){ $(this).html('<div class="msg err">Halaman gagal dimuat. Jalankan lewat web server (mis. Live Server / localhost), bukan file://.</div>'); return; }
      const init = window["init_"+p.replace("-","_")]; if(init) init();
    });
}
$(function(){
  renderHome();
  $(document).on("click",".nav-link,.nav-link-inline,.brand",function(e){ e.preventDefault(); const p=$(this).data("page"); loadPage(p); history.replaceState(null,"","#"+p); window.scrollTo(0,0); });
  $("#menuBtn").on("click",function(){ const o=$("#nav").toggleClass("open").hasClass("open"); $(this).attr("aria-expanded",o); });
  const h = location.hash.slice(1); if(h && h!=="home") loadPage(h);
});

/* ===== Halaman 2.b: Daftar Mahasiswa + simulasi validasi mingguan ===== */
function init_mahasiswa(){
  const $body=$("#mhsBody");
  function draw(){
    const q=$("#cari").val().toLowerCase();
    const rows=MHS.filter(m=>(m.nama+m.nim).toLowerCase().includes(q));
    $body.html(rows.length ? rows.map(m=>{
      const n=m.laporan.length, v=m.laporan.filter(r=>r.s==="divalidasi").length;
      return `<tr><td>${m.nim}</td><td>${m.nama}</td><td>${m.tempat}</td><td>${v}/${n}</td>
        <td><button class="btn btn-outline btn-sm" data-id="${m.id}">Lihat laporan</button></td></tr>`;
    }).join("") : '<tr><td colspan="5">Tidak ada mahasiswa yang cocok. Coba kata kunci lain.</td></tr>');
  }
  function detail(id){
    const m=MHS.find(x=>x.id==id), f=$("#filterStatus").val();
    const weeks=[...new Set(m.laporan.map(r=>r.m))];
    $("#detail").prop("hidden",false).html(`<div class="panel-head"><div><h2 style="margin:0">${m.nama}</h2><small>${m.nim} · ${m.tempat}</small></div>
      <button class="btn btn-outline btn-sm" id="tutup">Tutup</button></div>` + weeks.map(w=>{
      const rs=m.laporan.filter(r=>r.m===w), done=rs.every(r=>r.s==="divalidasi"), ok=rs.every(r=>r.s==="disetujui");
      const shown=rs.filter(r=>!f||r.s===f);
      const act=done?badge("divalidasi"):`<button class="btn btn-primary btn-sm btn-val" data-id="${m.id}" data-w="${w}" ${ok?"":"disabled"}>Validasi minggu ke-${w}</button>`;
      return `<div class="week"><h3>Minggu ke-${w} ${act}${!done&&!ok?'<small>(semua laporan harus berstatus disetujui)</small>':""}</h3>
        <div class="table-wrap"><table class="tbl"><tbody>${shown.map(r=>`<tr><td>${fmt(r.t)}</td><td>${r.j}</td><td>${badge(r.s)}</td></tr>`).join("")||'<tr><td>Tidak ada laporan dengan status ini.</td></tr>'}</tbody></table></div></div>`;
    }).join("")+'<div id="notif"></div>').data("id",id);
  }
  $("#cari").on("input",draw);
  $body.on("click","button",function(){ detail($(this).data("id")); $("#detail")[0].scrollIntoView({behavior:"smooth"}); });
  $("#filterStatus").on("change",()=>{ const id=$("#detail").data("id"); if(id) detail(id); });
  $("#detail").on("click","#tutup",()=>$("#detail").prop("hidden",true).data("id",null))
    .on("click",".btn-val",function(){
      const m=MHS.find(x=>x.id==$(this).data("id")), w=+$(this).data("w");
      m.laporan.filter(r=>r.m===w).forEach(r=>r.s="divalidasi");
      detail(m.id); draw();
      $("#notif").html(`<div class="msg ok">Minggu ke-${w} milik ${m.nama} berhasil divalidasi.</div>`);
    });
  draw();
}

/* ===== Halaman 2.c: Form Nilai Dosen + validasi jQuery ===== */
function init_input_nilai(){
  const $f=$("#formNilai");
  $("#mhs").append(MHS.map(m=>`<option value="${m.id}">${m.nim} – ${m.nama}</option>`).join(""));
  const rules={
    mhs:v=>v?"":"Pilih mahasiswa yang dinilai.",
    nilai_laporan:v=>num(v),
    nilai_keaktifan:v=>num(v),
    catatan:v=>v.trim().length<10?"Catatan minimal 10 karakter.":"",
    setuju:()=>$("#setuju").is(":checked")?"":"Centang pernyataan sebelum menyimpan."
  };
  function num(v){ if(v==="") return "Nilai wajib diisi."; const n=+v; if(isNaN(n)||n<0||n>100) return "Isi angka 0 sampai 100."; return ""; }
  function check(id){
    const $e=$("#"+id), err=rules[id]($e.is(":checkbox")?"":$e.val()), $g=$e.closest(".field");
    $g.toggleClass("invalid",!!err).toggleClass("valid",!err); $g.find(".error").text(err); return !err;
  }
  function hitung(){ const a=$("#nilai_laporan").val(), b=$("#nilai_keaktifan").val();
    $("#nilai_akhir").val(a!==""&&b!==""&&!isNaN(a)&&!isNaN(b)?((+a*0.6)+(+b*0.4)).toFixed(2):""); }
  $f.on("input change blur","input,select,textarea",function(){ if(this.id in rules) check(this.id); if(this.id.startsWith("nilai_")) hitung(); });
  $("#mhs").on("change",function(){ const m=MHS.find(x=>x.id==this.value);
    $("#infoMhs").html(m?`<div class="msg info">${m.nama} · ${m.tempat} · ${m.laporan.filter(r=>r.s==="divalidasi").length}/${m.laporan.length} laporan sudah divalidasi</div>`:""); });
  $f.on("submit",function(e){
    const ok=Object.keys(rules).map(check).every(Boolean);
    if(!ok){ e.preventDefault(); $("#formMsg").html('<div class="msg err">Masih ada isian yang salah. Perbaiki yang ditandai merah.</div>'); $(".invalid:first input,.invalid:first select,.invalid:first textarea").first().focus(); return; }
    $("#formMsg").html('<div class="msg ok">Data valid. Mengirim ke server…</div>');
  });
  $f.on("reset",()=>{ setTimeout(()=>{ $(".field").removeClass("valid invalid").find(".error").text(""); $("#infoMhs,#formMsg").empty(); },0); });
}
