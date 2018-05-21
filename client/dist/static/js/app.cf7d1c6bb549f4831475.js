webpackJsonp([1],{14:function(t,e,s){"use strict";var a=s(5),i=s.n(a);e.a={data:function(){return{loading:!1,suppliers:[],dayOfWeek:(new Date).getDay()}},mounted:function(){this.listSuppliers()},methods:{listSuppliers:function(){var t=this;this.loading=!0,i.a.get("https://aarixafood.steffbeckers.eu/api/suppliers").then(function(e){t.loading=!1,t.suppliers=e.data,console.log(t.suppliers)}).catch(function(e){t.loading=!1,console.error(e)})},navigateToSupplier:function(t){this.$router.push({name:"SupplierDetail",params:{slug:t}})}},name:"Suppliers"}},140:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=s(3),i=s(143),n=s(167),r=s(176),o=s.n(r),l=s(177),u=(s.n(l),s(178)),c=(s.n(u),s(179)),v=s(0),p=s.n(v),m=s(16),d=s.n(m);a.a.use(d.a),a.a.filter("formatDate",function(t){if(t)return p()(String(t)).format("DD/MM/YYYY")}),a.a.filter("formatTime",function(t){if(t)return p()(String(t)).format("HH:mm")}),a.a.filter("formatDateTime",function(t){if(t)return p()(String(t)).format("DD/MM/YYYY HH:mm")}),a.a.filter("formatWebsite",function(t){if(t){var e=String(t).toLocaleLowerCase().replace("https","").replace("http","").replace("://","");return e.endsWith("/")&&(e=e.slice(0,-1)),e}}),a.a.use(o.a),a.a.config.productionTip=!1,new a.a({el:"#app",router:n.a,store:c.a,components:{App:i.a},template:"<App/>"})},143:function(t,e,s){"use strict";function a(t){s(144)}var i=s(8),n=s(164),r=s(2),o=a,l=r(i.a,n.a,!1,o,"data-v-12726899",null);e.a=l.exports},144:function(t,e){},15:function(t,e,s){"use strict";var a=s(5),i=s.n(a);e.a={data:function(){return{loading:!1,supplier:{}}},mounted:function(){this.getSupplier()},methods:{getSupplier:function(){var t=this;this.loading=!0,i.a.get("https://aarixafood.steffbeckers.eu/api/suppliers/slug/"+this.$route.params.slug).then(function(e){t.loading=!1,t.supplier=e.data,console.log(t.supplier)}).catch(function(e){t.loading=!1,console.error(e)})}},watch:{$route:function(t,e){this.getSupplier()}},name:"SupplierDetail"}},164:function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-app",[a("v-navigation-drawer",{attrs:{persistent:"","mini-variant":t.miniVariant,clipped:t.clipped,"enable-resize-watcher":"",fixed:"",app:""},model:{value:t.drawer,callback:function(e){t.drawer=e},expression:"drawer"}},[a("v-container",{attrs:{fluid:""}},[a("v-layout",{staticClass:"mb-3",attrs:{row:""}},[a("v-layout",{attrs:{column:"","align-center":""}},[a("img",{staticClass:"mt-3 mb-3",attrs:{src:s(165),alt:"aariXa"}}),t._v(" "),a("p",[t._v("Bestel eten bij aariXa!")])])],1),t._v(" "),this.$store.state.authenticated?t._e():a("v-layout",{staticClass:"mb-3",attrs:{row:""}},[a("v-layout",{attrs:{column:""}},[a("h2",[t._v("Aanmelden")])])],1),t._v(" "),this.$store.state.authenticated?t._e():a("v-layout",{staticClass:"mb-4",attrs:{row:""}},[a("v-layout",{attrs:{column:""}},[a("v-form",{ref:"loginForm",attrs:{"lazy-validation":""},model:{value:t.loginFormValid,callback:function(e){t.loginFormValid=e},expression:"loginFormValid"}},[a("v-text-field",{attrs:{rules:t.emailRules,label:"E-mail",required:"",loading:t.loginFormLoading},model:{value:t.email,callback:function(e){t.email=e},expression:"email"}}),t._v(" "),a("v-btn",{attrs:{block:"",color:"primary",disabled:!t.loginFormValid},on:{click:t.sendLoginCredentialsEmail}},[t._v("\n              Verstuur e-mail\n            ")])],1)],1)],1)],1),t._v(" "),this.$store.state.authenticated?a("v-toolbar",{staticClass:"transparent mb-2",attrs:{flat:""}},[a("v-list",{staticClass:"pa-0"},[a("v-list-tile",{attrs:{avatar:""}},[this.$store.state.user.avatar?t._e():a("v-list-tile-avatar",{attrs:{color:"primary"}},[a("span",{staticClass:"white--text headline"},[t._v(t._s(t.firstLetterOfUser))])]),t._v(" "),this.$store.state.user.avatar?a("v-list-tile-avatar",[a("img",{attrs:{src:this.$store.state.user.avatar,alt:this.$store.state.user.username}})]):t._e(),t._v(" "),this.$store.state.user.username?a("v-list-tile-content",[a("v-list-tile-title",[t._v(t._s(this.$store.state.user.username))])],1):t._e(),t._v(" "),a("v-list-tile-action",{on:{click:t.signOut}},[a("v-icon",[t._v("fa-sign-out")])],1)],1)],1)],1):t._e(),t._v(" "),a("v-list",t._l(t.sideMenuItems,function(e,s){return a("v-list-tile",{key:s,attrs:{value:"true",to:e.page,exact:""}},[a("v-list-tile-action",[a("v-icon",{domProps:{innerHTML:t._s(e.icon)}})],1),t._v(" "),a("v-list-tile-content",[a("v-list-tile-title",{domProps:{textContent:t._s(e.title)}})],1)],1)}))],1),t._v(" "),a("v-toolbar",{attrs:{"clipped-left":t.clipped,app:""}},[a("v-toolbar-side-icon",{on:{click:function(e){e.stopPropagation(),t.drawer=!t.drawer}}}),t._v(" "),a("img",{attrs:{src:s(166),alt:"aariXa Schild"}}),t._v(" "),a("v-toolbar-title",{domProps:{textContent:t._s(t.title)}}),t._v(" "),a("v-spacer"),t._v(" "),a("v-toolbar-items",[a("v-btn",{attrs:{to:{name:"SupplierDetail",params:{slug:"chanry"}},flat:""}},[t._v("Chanry")]),t._v(" "),a("v-btn",{attrs:{to:{name:"SupplierDetail",params:{slug:"orient"}},flat:""}},[t._v("Orient")])],1)],1),t._v(" "),a("v-content",{staticClass:"mt-2"},[a("router-view")],1),t._v(" "),a("v-footer",{attrs:{fixed:t.fixed,app:""}},[a("div",{staticClass:"ml-2",attrs:{id:"buildInfo"}},[t._v("Laatste bijwerking: "+t._s(t.buildDateTime))]),t._v(" "),a("div",{staticClass:"mr-2",attrs:{id:"copyright"}},[t._v("© "),a("a",{attrs:{href:"http://steffbeckers.eu/"}},[t._v("Steff")])])])],1)},i=[],n={render:a,staticRenderFns:i};e.a=n},165:function(t,e,s){t.exports=s.p+"static/img/aariXa_Logo.6ad6f1f.png"},166:function(t,e,s){t.exports=s.p+"static/img/aariXa_Shield_32x32.1dd4d61.png"},167:function(t,e,s){"use strict";var a=s(3),i=s(168),n=s(169),r=s(171),o=s(174);a.a.use(i.a),e.a=new i.a({routes:[{path:"/leveranciers/:slug",name:"SupplierDetail",component:o.a},{path:"/leveranciers",name:"Suppliers",component:r.a},{path:"/",name:"Root",component:n.a}]})},169:function(t,e,s){"use strict";var a=s(170),i=s(2),n=i(null,a.a,!1,null,null,null);e.a=n.exports},170:function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-container",{attrs:{fluid:""}},[s("v-layout",{attrs:{column:""}},[s("div",{staticClass:"title"},[t._v("Bestellingen")])])],1)},i=[],n={render:a,staticRenderFns:i};e.a=n},171:function(t,e,s){"use strict";function a(t){s(172)}var i=s(14),n=s(173),r=s(2),o=a,l=r(i.a,n.a,!1,o,"data-v-60d522dc",null);e.a=l.exports},172:function(t,e){},173:function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-container",{attrs:{fluid:""}},[s("v-layout",{staticClass:"mb-3",attrs:{row:""}},[s("v-layout",{attrs:{column:""}},[s("div",{staticClass:"title"},[t._v("Leveranciers")])])],1),t._v(" "),s("v-layout",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}],staticClass:"mb-3",attrs:{row:""}},[s("v-layout",{attrs:{column:"","align-center":""}},[s("v-progress-circular",{attrs:{indeterminate:"",color:"primary"}})],1)],1),t._v(" "),s("v-layout",{attrs:{row:"",wrap:""}},t._l(t.suppliers,function(e){return s("v-flex",{key:e.id,attrs:{xl3:"",lg4:"",md6:"",sm12:""}},[s("v-card",[e.slug?s("v-card-media",{attrs:{src:"/static/img/suppliers/"+e.slug+"/1_min.jpg",height:"150px"},on:{click:function(s){t.navigateToSupplier(e.slug)}}}):t._e(),t._v(" "),s("v-card-title",{attrs:{"primary-title":""},on:{click:function(s){t.navigateToSupplier(e.slug)}}},[s("div",[s("h3",{staticClass:"headline mb-1"},[t._v(t._s(e.name))]),t._v(" "),s("div",[e.telephone?s("span",{staticClass:"telephone"},[t._v(t._s(e.telephone))]):t._e(),t._v(" "),e.telephone&&e.website?s("span",[t._v(" - ")]):t._e(),t._v(" "),e.website?s("span",{staticClass:"website"},[t._v(t._s(t._f("formatWebsite")(e.website)))]):t._e()]),t._v(" "),e.openingHours&&e.openingHours[t.dayOfWeek]?s("div",t._l(e.openingHours[t.dayOfWeek],function(e,a){return s("span",{key:a},[t._v("\n                "+t._s(e.from)+" - "+t._s(e.until)+"\n              ")])})):t._e()])]),t._v(" "),s("v-card-actions",[e.telephone?s("v-btn",{attrs:{href:"tel:"+e.telephone,flat:""}},[t._v("\n            Bellen\n          ")]):t._e(),t._v(" "),e.website?s("v-btn",{attrs:{href:e.website,target:"_blank",flat:""}},[t._v("\n            Website\n          ")]):t._e(),t._v(" "),s("v-btn",{attrs:{flat:""},on:{click:function(s){t.navigateToSupplier(e.slug)}}},[t._v("\n            Menu\n          ")])],1)],1)],1)}))],1)},i=[],n={render:a,staticRenderFns:i};e.a=n},174:function(t,e,s){"use strict";var a=s(15),i=s(175),n=s(2),r=n(a.a,i.a,!1,null,null,null);e.a=r.exports},175:function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-container",{attrs:{fluid:""}},[s("v-layout",{attrs:{column:""}},[s("div",{staticClass:"title"},[t._v(t._s(t.supplier.name))])])],1)},i=[],n={render:a,staticRenderFns:i};e.a=n},177:function(t,e){},178:function(t,e){},179:function(t,e,s){"use strict";var a=s(180),i=s.n(a),n=s(3),r=s(183),o=s(16),l=s.n(o);n.a.use(r.a),n.a.use(l.a),e.a=new r.a.Store({state:{authenticated:null!==l.a.get("$aariXaFood$token"),token:l.a.get("$aariXaFood$token"),user:JSON.parse(l.a.get("$aariXaFood$user"))},mutations:{authenticate:function(t,e){t.authenticated=!0,t.token=e.id,t.user=e.user,l.a.set("$aariXaFood$token",e.id,{expires:e.ttl+"s"}),l.a.set("$aariXaFood$user",i()(e.user),{expires:e.ttl+"s"})},signOut:function(t){t.authenticated=!1,t.token=null,t.user=null,l.a.remove("$aariXaFood$token"),l.a.remove("$aariXaFood$user")}}})},186:function(t,e,s){function a(t){return s(i(t))}function i(t){var e=n[t];if(!(e+1))throw new Error("Cannot find module '"+t+"'.");return e}var n={"./af":17,"./af.js":17,"./ar":18,"./ar-dz":19,"./ar-dz.js":19,"./ar-kw":20,"./ar-kw.js":20,"./ar-ly":21,"./ar-ly.js":21,"./ar-ma":22,"./ar-ma.js":22,"./ar-sa":23,"./ar-sa.js":23,"./ar-tn":24,"./ar-tn.js":24,"./ar.js":18,"./az":25,"./az.js":25,"./be":26,"./be.js":26,"./bg":27,"./bg.js":27,"./bm":28,"./bm.js":28,"./bn":29,"./bn.js":29,"./bo":30,"./bo.js":30,"./br":31,"./br.js":31,"./bs":32,"./bs.js":32,"./ca":33,"./ca.js":33,"./cs":34,"./cs.js":34,"./cv":35,"./cv.js":35,"./cy":36,"./cy.js":36,"./da":37,"./da.js":37,"./de":38,"./de-at":39,"./de-at.js":39,"./de-ch":40,"./de-ch.js":40,"./de.js":38,"./dv":41,"./dv.js":41,"./el":42,"./el.js":42,"./en-au":43,"./en-au.js":43,"./en-ca":44,"./en-ca.js":44,"./en-gb":45,"./en-gb.js":45,"./en-ie":46,"./en-ie.js":46,"./en-il":47,"./en-il.js":47,"./en-nz":48,"./en-nz.js":48,"./eo":49,"./eo.js":49,"./es":50,"./es-do":51,"./es-do.js":51,"./es-us":52,"./es-us.js":52,"./es.js":50,"./et":53,"./et.js":53,"./eu":54,"./eu.js":54,"./fa":55,"./fa.js":55,"./fi":56,"./fi.js":56,"./fo":57,"./fo.js":57,"./fr":58,"./fr-ca":59,"./fr-ca.js":59,"./fr-ch":60,"./fr-ch.js":60,"./fr.js":58,"./fy":61,"./fy.js":61,"./gd":62,"./gd.js":62,"./gl":63,"./gl.js":63,"./gom-latn":64,"./gom-latn.js":64,"./gu":65,"./gu.js":65,"./he":66,"./he.js":66,"./hi":67,"./hi.js":67,"./hr":68,"./hr.js":68,"./hu":69,"./hu.js":69,"./hy-am":70,"./hy-am.js":70,"./id":71,"./id.js":71,"./is":72,"./is.js":72,"./it":73,"./it.js":73,"./ja":74,"./ja.js":74,"./jv":75,"./jv.js":75,"./ka":76,"./ka.js":76,"./kk":77,"./kk.js":77,"./km":78,"./km.js":78,"./kn":79,"./kn.js":79,"./ko":80,"./ko.js":80,"./ky":81,"./ky.js":81,"./lb":82,"./lb.js":82,"./lo":83,"./lo.js":83,"./lt":84,"./lt.js":84,"./lv":85,"./lv.js":85,"./me":86,"./me.js":86,"./mi":87,"./mi.js":87,"./mk":88,"./mk.js":88,"./ml":89,"./ml.js":89,"./mn":90,"./mn.js":90,"./mr":91,"./mr.js":91,"./ms":92,"./ms-my":93,"./ms-my.js":93,"./ms.js":92,"./mt":94,"./mt.js":94,"./my":95,"./my.js":95,"./nb":96,"./nb.js":96,"./ne":97,"./ne.js":97,"./nl":98,"./nl-be":99,"./nl-be.js":99,"./nl.js":98,"./nn":100,"./nn.js":100,"./pa-in":101,"./pa-in.js":101,"./pl":102,"./pl.js":102,"./pt":103,"./pt-br":104,"./pt-br.js":104,"./pt.js":103,"./ro":105,"./ro.js":105,"./ru":106,"./ru.js":106,"./sd":107,"./sd.js":107,"./se":108,"./se.js":108,"./si":109,"./si.js":109,"./sk":110,"./sk.js":110,"./sl":111,"./sl.js":111,"./sq":112,"./sq.js":112,"./sr":113,"./sr-cyrl":114,"./sr-cyrl.js":114,"./sr.js":113,"./ss":115,"./ss.js":115,"./sv":116,"./sv.js":116,"./sw":117,"./sw.js":117,"./ta":118,"./ta.js":118,"./te":119,"./te.js":119,"./tet":120,"./tet.js":120,"./tg":121,"./tg.js":121,"./th":122,"./th.js":122,"./tl-ph":123,"./tl-ph.js":123,"./tlh":124,"./tlh.js":124,"./tr":125,"./tr.js":125,"./tzl":126,"./tzl.js":126,"./tzm":127,"./tzm-latn":128,"./tzm-latn.js":128,"./tzm.js":127,"./ug-cn":129,"./ug-cn.js":129,"./uk":130,"./uk.js":130,"./ur":131,"./ur.js":131,"./uz":132,"./uz-latn":133,"./uz-latn.js":133,"./uz.js":132,"./vi":134,"./vi.js":134,"./x-pseudo":135,"./x-pseudo.js":135,"./yo":136,"./yo.js":136,"./zh-cn":137,"./zh-cn.js":137,"./zh-hk":138,"./zh-hk.js":138,"./zh-tw":139,"./zh-tw.js":139};a.keys=function(){return Object.keys(n)},a.resolve=i,t.exports=a,a.id=186},8:function(t,e,s){"use strict";var a=s(5),i=s.n(a);e.a={data:function(){return{loginFormLoading:!1,loginFormValid:!1,email:"@aariXa.be",emailRules:[function(t){return!!t||"E-mail is vereist"},function(t){return/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(t)||"E-mail moet correct zijn"}],sideMenuItems:[{icon:"dashboard",title:"Bestellingen",page:{name:"Root"}},{icon:"list",title:"Leveranciers",page:{name:"Suppliers"}}],buildDateTime:"21/05/2018 18:35:13",clipped:!1,drawer:!this.$store.state.authenticated,miniVariant:!1,fixed:!0,title:"aariXaFood"}},mounted:function(){this.loginWithCredentialsFromEmail()},methods:{sendLoginCredentialsEmail:function(){var t=this;this.$refs.loginForm.validate()&&(this.loginFormLoading=!0,i.a.post("https://aarixafood.steffbeckers.eu/api/usermodels/login",{email:this.email}).then(function(e){t.loginFormLoading=!1,e.data.AUTH_EMAIL_SENT&&console.log("E-mail sent")}).catch(function(e){t.loginFormLoading=!1,"LOGIN_FAILED"===e.code&&console.log("Login failed")}))},loginWithCredentialsFromEmail:function(){var t=this.$route.query.credentials;if(t){var e=atob(t);if("{"===e.charAt(0)&&"}"===e.charAt(e.length-1)){var s=JSON.parse(e);this.$store.commit("authenticate",s),this.$router.push({path:"/"})}}},signOut:function(){this.$store.commit("signOut")}},computed:{firstLetterOfUser:function(){return this.$store.state.user.username?this.$store.state.user.username.substr(0,1):""}},name:"App"}}},[140]);
//# sourceMappingURL=app.cf7d1c6bb549f4831475.js.map