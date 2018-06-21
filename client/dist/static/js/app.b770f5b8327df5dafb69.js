webpackJsonp([7],{185:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a(28),r=a.n(s),i=a(184),n=a.n(i),o=a(25),l=a(216),u=a(221),c=a(226),m=a.n(c),d=a(227),v=(a.n(d),a(228)),f=(a.n(v),a(229)),p=a.n(f),h=a(248),j=a(0),g=a.n(j),_=a(174),b=a.n(_);o.a.use(b.a),o.a.prototype.$axios=p.a;var k=o.a.cookie.get("$aariXaFood$token");k&&(o.a.prototype.$axios.defaults.headers.common.Authorization=k),o.a.prototype.$axios.interceptors.request.use(function(t){return h.a.commit("loader",!0),t},function(t){return h.a.commit("loader",!1),n.a.reject(t)});var $=0;o.a.prototype.$axios.interceptors.response.use(function(t){return h.a.commit("loader",!1),t},function(t){return h.a.commit("loader",!1),0===t.request.status&&0===$?($++,t.response={data:{error:{message:"Kan niet connecteren naar API."}}},n.a.reject(t.response.data.error)):0===t.request.status?n.a.resolve(t):(t.request&&console.log(t.request.responseURL),t.response&&console.log(t.response.status,JSON.parse(r()(t.response.data))),t.response&&401===t.response.status&&(h.a.commit("signOut"),h.a.commit("drawer",!0)),n.a.reject(t.response.data.error))}),u.a.beforeEach(function(t,e,a){t.matched.some(function(t){return t.meta.requiresAdmin})?h.a.state.isAdmin?a():a({name:"Root",query:{redirect:t.fullPath}}):t.matched.some(function(t){return t.meta.requiresAuth})?h.a.state.authenticated?a():a({name:"Root",query:{redirect:t.fullPath}}):a()}),o.a.filter("formatDate",function(t){if(t)return g()(String(t)).format("DD/MM/YYYY")}),o.a.filter("formatTime",function(t){if(t)return g()(String(t)).format("HH:mm")}),o.a.filter("formatDateTime",function(t){if(t)return g()(String(t)).format("DD/MM/YYYY HH:mm")}),o.a.filter("formatWebsite",function(t){if(t){var e=String(t).toLocaleLowerCase().replace("https","").replace("http","").replace("://","");return e.endsWith("/")&&(e=e.slice(0,-1)),e}}),o.a.filter("formatMoney",function(t){return t&&"number"==typeof t?0===t?"":"€ "+t.toFixed(2):""}),o.a.use(m.a),o.a.config.productionTip=!1,new o.a({el:"#app",router:u.a,store:h.a,components:{App:l.a},template:"<App/>"})},216:function(t,e,a){"use strict";function s(t){a(217)}var r=a(43),i=a(219),n=a(27),o=s,l=n(r.a,i.a,!1,o,"data-v-4f69625c",null);e.a=l.exports},217:function(t,e){},219:function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-app",[s("v-navigation-drawer",{attrs:{persistent:"","mini-variant":t.miniVariant,clipped:t.clipped,"enable-resize-watcher":"",fixed:"",app:""},model:{value:t.$store.state.drawer,callback:function(e){t.$set(t.$store.state,"drawer",e)},expression:"$store.state.drawer"}},[s("v-container",{attrs:{fluid:""}},[s("v-layout",{staticClass:"mb-3",attrs:{row:""}},[s("v-layout",{attrs:{column:"","align-center":""}},[s("img",{staticClass:"mt-3 mb-3",attrs:{src:a(220),alt:"aariXa"}}),t._v(" "),s("p",[t._v("Bestel eten bij aariXa!")])])],1),t._v(" "),this.$store.state.authenticated?t._e():s("v-layout",{staticClass:"mb-3",attrs:{row:""}},[s("v-layout",{attrs:{column:""}},[s("h2",[t._v("Aanmelden")])])],1),t._v(" "),this.$store.state.authenticated?t._e():s("v-layout",{staticClass:"mb-4",attrs:{row:""}},[s("v-layout",{attrs:{column:""}},[s("v-alert",{attrs:{value:t.emailSent,type:"success"}},[t._v("\n            E-mail verzonden naar "+t._s(t.email)+". Klik op de link in de e-mail om in te loggen.\n          ")]),t._v(" "),s("v-alert",{attrs:{value:t.emailError,type:"error"}},[t._v("\n            Er ging even iets mis, probeer het later opnieuw. Of stuur een "),s("a",{staticStyle:{color:"#fff"},attrs:{href:"mailto:steff@steffbeckers.eu?subject=aariXaFood - Error bij aanmelden&body=Dag Steff, Ik kan me niet aanmelden op aariXaFood. ..."}},[t._v("e-mail naar Steff")]),t._v(".\n          ")]),t._v(" "),s("v-form",{ref:"loginForm",on:{submit:t.sendLoginCredentialsEmail},model:{value:t.loginFormValid,callback:function(e){t.loginFormValid=e},expression:"loginFormValid"}},[s("v-text-field",{attrs:{id:"email",rules:t.emailRules,label:"E-mail",required:"",loading:this.$store.state.loading,clearable:""},model:{value:t.email,callback:function(e){t.email=e},expression:"email"}}),t._v(" "),s("v-btn",{staticClass:"elevation-0",attrs:{block:"",color:"primary",disabled:!t.loginFormValid,type:"submit"}},[t._v("\n              Verstuur e-mail\n            ")])],1)],1)],1)],1),t._v(" "),this.$store.state.authenticated?s("v-toolbar",{staticClass:"transparent mb-2",attrs:{flat:""}},[s("v-list",{staticClass:"pa-0"},[s("v-list-tile",{attrs:{avatar:""}},[this.$store.state.user.avatar?t._e():s("v-list-tile-avatar",{attrs:{color:"primary"}},[s("span",{staticClass:"white--text headline"},[t._v(t._s(t.firstLetterOfUser))])]),t._v(" "),this.$store.state.user.avatar?s("v-list-tile-avatar",[s("img",{attrs:{src:this.$store.state.user.avatar,alt:this.$store.state.user.username}})]):t._e(),t._v(" "),this.$store.state.user.username?s("v-list-tile-content",[s("v-list-tile-title",[t._v(t._s(this.$store.state.user.username))]),t._v(" "),this.$store.state.isAdmin?s("v-list-tile-sub-title",[t._v("Administrator")]):t._e(),t._v(" "),this.$store.state.isOfficeManager?s("v-list-tile-sub-title",[t._v("Office Manager")]):t._e()],1):t._e(),t._v(" "),s("v-list-tile-action",{on:{click:t.signOut}},[s("v-icon",[t._v("fa-sign-out")])],1)],1)],1)],1):t._e(),t._v(" "),s("v-list",t._l(t.sideMenuItems,function(e,a){return s("v-list-tile",{key:a,attrs:{to:e.page,exact:""}},[s("v-list-tile-action",[s("v-icon",{domProps:{innerHTML:t._s(e.icon)}})],1),t._v(" "),s("v-list-tile-title",{domProps:{textContent:t._s(e.title)}})],1)})),t._v(" "),t.$store.state.isAdmin?s("v-list",[s("v-list-group",{attrs:{"prepend-icon":"account_circle"}},[s("v-list-tile",{attrs:{slot:"activator"},slot:"activator"},[s("v-list-tile-title",[t._v("Administratie")])],1),t._v(" "),s("v-list-tile",{attrs:{to:{name:"AdminUserModels"}}},[s("v-list-tile-action",[s("v-icon",[t._v("people")])],1),t._v(" "),s("v-list-tile-title",[t._v("aariXianen")])],1)],1)],1):t._e()],1),t._v(" "),s("v-toolbar",{attrs:{"clipped-left":t.clipped,app:"",color:"primary white--text"}},[s("v-toolbar-side-icon",{staticClass:"white--text mr-1",on:{click:function(e){e.stopPropagation(),t.$store.commit("drawer",!t.$store.state.drawer)}}}),t._v(" "),t.$store.state.loading?s("v-progress-circular",{attrs:{size:50,indeterminate:!0,color:"white"}},[s("img",{staticClass:"mt-2",attrs:{src:a(44),alt:"aariXa Schild",width:"32",height:"32"}})]):t._e(),t._v(" "),t.$store.state.loading?t._e():s("div",{staticStyle:{position:"relative",width:"50px",height:"50px"}},[s("div",{staticStyle:{position:"absolute",width:"32px",height:"32px",left:"9px",top:"10px"}},[s("img",{attrs:{src:a(44),alt:"aariXa Schild",width:"32",height:"32"}})])]),t._v(" "),s("v-toolbar-title",{staticClass:"ml-1 white--text",domProps:{textContent:t._s(t.title)}}),t._v(" "),s("v-spacer"),t._v(" "),s("v-toolbar-items",[s("v-btn",{staticClass:"white--text",attrs:{to:{name:"SupplierDetail",params:{slug:"chanry"}},flat:""}},[t._v("Chanry")]),t._v(" "),s("v-btn",{staticClass:"white--text",attrs:{to:{name:"SupplierDetail",params:{slug:"orient"}},flat:""}},[t._v("Orient")])],1)],1),t._v(" "),s("v-content",[s("router-view")],1),t._v(" "),s("v-bottom-nav",{staticClass:"elevation-0",staticStyle:{"background-color":"rgba(255, 255, 255, 0.75)"},attrs:{fixed:t.fixed,value:t.showBottomNav}},[s("v-btn",{attrs:{to:{name:"Root"},exact:"",flat:"",color:"primary"}},[s("span",[t._v("Bestellingen")]),t._v(" "),s("v-icon",[t._v("dashboard")])],1),t._v(" "),s("v-btn",{attrs:{to:{name:"Suppliers"},flat:"",color:"primary"}},[s("span",[t._v("Leveranciers")]),t._v(" "),s("v-icon",[t._v("fastfood")])],1),t._v(" "),s("v-btn",{attrs:{to:{name:"Fridge"},flat:"",color:"primary"}},[s("span",[t._v("Koelkast")]),t._v(" "),s("v-icon",[t._v("kitchen")])],1)],1),t._v(" "),s("v-footer",{attrs:{fixed:t.fixed,app:""}},[s("div",{staticClass:"ml-2",attrs:{id:"buildInfo"}},[t._v("Laatste bijwerking: "+t._s(t.buildDateTime))]),t._v(" "),s("div",{staticClass:"mr-2",attrs:{id:"copyright"}},[t._v("© "),s("a",{attrs:{href:"http://steffbeckers.eu/"}},[t._v("Steff")])])])],1)},r=[],i={render:s,staticRenderFns:r};e.a=i},220:function(t,e,a){t.exports=a.p+"static/img/aariXa_Logo.6ad6f1f.png"},221:function(t,e,a){"use strict";var s=a(25),r=a(222),i=a(223),n=function(){return a.e(1).then(a.bind(null,253))},o=function(){return a.e(4).then(a.bind(null,254))},l=function(){return a.e(0).then(a.bind(null,255))},u=function(){return a.e(5).then(a.bind(null,256))},c=function(){return a.e(2).then(a.bind(null,257))},m=function(){return a.e(3).then(a.bind(null,258))};s.a.use(r.a),e.a=new r.a({routes:[{path:"/admin/aariXianen",name:"AdminUserModels",component:m,meta:{requiresAdmin:!0}},{path:"/leveranciers/:slug",name:"SupplierDetail",component:l},{path:"/keuken/koelkast",name:"Fridge",component:c},{path:"/keuken",name:"Kitchen",component:u},{path:"/leveranciers",name:"Suppliers",component:o},{path:"/",name:"Root",component:n},{path:"*",name:"FourOhhFour",component:i.a}]})},223:function(t,e,a){"use strict";var s=a(45),r=a(224),i=a(27),n=i(s.a,r.a,!1,null,null,null);e.a=n.exports},224:function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("transition",{attrs:{name:"fade"}},[a("v-container",{attrs:{"grid-list-lg":"",fluid:""}},[a("v-layout",{attrs:{row:""}},[a("v-flex",[a("div",{staticClass:"title"},[t._v("FourOhhFour")])])],1),t._v(" "),a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",[a("p",[t._v("Deze pagina kan niet gevonden worden.")])])],1)],1)],1)},r=[],i={render:s,staticRenderFns:r};e.a=i},225:function(t,e,a){function s(t){return a(r(t))}function r(t){var e=i[t];if(!(e+1))throw new Error("Cannot find module '"+t+"'.");return e}var i={"./af":46,"./af.js":46,"./ar":47,"./ar-dz":48,"./ar-dz.js":48,"./ar-kw":49,"./ar-kw.js":49,"./ar-ly":50,"./ar-ly.js":50,"./ar-ma":51,"./ar-ma.js":51,"./ar-sa":52,"./ar-sa.js":52,"./ar-tn":53,"./ar-tn.js":53,"./ar.js":47,"./az":54,"./az.js":54,"./be":55,"./be.js":55,"./bg":56,"./bg.js":56,"./bm":57,"./bm.js":57,"./bn":58,"./bn.js":58,"./bo":59,"./bo.js":59,"./br":60,"./br.js":60,"./bs":61,"./bs.js":61,"./ca":62,"./ca.js":62,"./cs":63,"./cs.js":63,"./cv":64,"./cv.js":64,"./cy":65,"./cy.js":65,"./da":66,"./da.js":66,"./de":67,"./de-at":68,"./de-at.js":68,"./de-ch":69,"./de-ch.js":69,"./de.js":67,"./dv":70,"./dv.js":70,"./el":71,"./el.js":71,"./en-au":72,"./en-au.js":72,"./en-ca":73,"./en-ca.js":73,"./en-gb":74,"./en-gb.js":74,"./en-ie":75,"./en-ie.js":75,"./en-il":76,"./en-il.js":76,"./en-nz":77,"./en-nz.js":77,"./eo":78,"./eo.js":78,"./es":79,"./es-do":80,"./es-do.js":80,"./es-us":81,"./es-us.js":81,"./es.js":79,"./et":82,"./et.js":82,"./eu":83,"./eu.js":83,"./fa":84,"./fa.js":84,"./fi":85,"./fi.js":85,"./fo":86,"./fo.js":86,"./fr":87,"./fr-ca":88,"./fr-ca.js":88,"./fr-ch":89,"./fr-ch.js":89,"./fr.js":87,"./fy":90,"./fy.js":90,"./gd":91,"./gd.js":91,"./gl":92,"./gl.js":92,"./gom-latn":93,"./gom-latn.js":93,"./gu":94,"./gu.js":94,"./he":95,"./he.js":95,"./hi":96,"./hi.js":96,"./hr":97,"./hr.js":97,"./hu":98,"./hu.js":98,"./hy-am":99,"./hy-am.js":99,"./id":100,"./id.js":100,"./is":101,"./is.js":101,"./it":102,"./it.js":102,"./ja":103,"./ja.js":103,"./jv":104,"./jv.js":104,"./ka":105,"./ka.js":105,"./kk":106,"./kk.js":106,"./km":107,"./km.js":107,"./kn":108,"./kn.js":108,"./ko":109,"./ko.js":109,"./ky":110,"./ky.js":110,"./lb":111,"./lb.js":111,"./lo":112,"./lo.js":112,"./lt":113,"./lt.js":113,"./lv":114,"./lv.js":114,"./me":115,"./me.js":115,"./mi":116,"./mi.js":116,"./mk":117,"./mk.js":117,"./ml":118,"./ml.js":118,"./mn":119,"./mn.js":119,"./mr":120,"./mr.js":120,"./ms":121,"./ms-my":122,"./ms-my.js":122,"./ms.js":121,"./mt":123,"./mt.js":123,"./my":124,"./my.js":124,"./nb":125,"./nb.js":125,"./ne":126,"./ne.js":126,"./nl":127,"./nl-be":128,"./nl-be.js":128,"./nl.js":127,"./nn":129,"./nn.js":129,"./pa-in":130,"./pa-in.js":130,"./pl":131,"./pl.js":131,"./pt":132,"./pt-br":133,"./pt-br.js":133,"./pt.js":132,"./ro":134,"./ro.js":134,"./ru":135,"./ru.js":135,"./sd":136,"./sd.js":136,"./se":137,"./se.js":137,"./si":138,"./si.js":138,"./sk":139,"./sk.js":139,"./sl":140,"./sl.js":140,"./sq":141,"./sq.js":141,"./sr":142,"./sr-cyrl":143,"./sr-cyrl.js":143,"./sr.js":142,"./ss":144,"./ss.js":144,"./sv":145,"./sv.js":145,"./sw":146,"./sw.js":146,"./ta":147,"./ta.js":147,"./te":148,"./te.js":148,"./tet":149,"./tet.js":149,"./tg":150,"./tg.js":150,"./th":151,"./th.js":151,"./tl-ph":152,"./tl-ph.js":152,"./tlh":153,"./tlh.js":153,"./tr":154,"./tr.js":154,"./tzl":155,"./tzl.js":155,"./tzm":156,"./tzm-latn":157,"./tzm-latn.js":157,"./tzm.js":156,"./ug-cn":158,"./ug-cn.js":158,"./uk":159,"./uk.js":159,"./ur":160,"./ur.js":160,"./uz":161,"./uz-latn":162,"./uz-latn.js":162,"./uz.js":161,"./vi":163,"./vi.js":163,"./x-pseudo":164,"./x-pseudo.js":164,"./yo":165,"./yo.js":165,"./zh-cn":166,"./zh-cn.js":166,"./zh-hk":167,"./zh-hk.js":167,"./zh-tw":168,"./zh-tw.js":168};s.keys=function(){return Object.keys(i)},s.resolve=r,t.exports=s,s.id=225},227:function(t,e){},228:function(t,e){},248:function(t,e,a){"use strict";var s=a(28),r=a.n(s),i=a(25),n=a(249),o=a(174),l=a.n(o);i.a.use(n.a),i.a.use(l.a),e.a=new n.a.Store({state:{loading:!1,loadingCounter:0,drawer:!1,authenticated:null!==i.a.cookie.get("$aariXaFood$token"),token:i.a.cookie.get("$aariXaFood$token"),user:JSON.parse(i.a.cookie.get("$aariXaFood$user")),isAdmin:!(!JSON.parse(i.a.cookie.get("$aariXaFood$user"))||!JSON.parse(i.a.cookie.get("$aariXaFood$user")).roles)&&JSON.parse(i.a.cookie.get("$aariXaFood$user")).roles.includes("Administrator"),isOfficeManager:!(!JSON.parse(i.a.cookie.get("$aariXaFood$user"))||!JSON.parse(i.a.cookie.get("$aariXaFood$user")).roles)&&JSON.parse(i.a.cookie.get("$aariXaFood$user")).roles.includes("OfficeManager")},mutations:{loader:function(t,e){e?t.loadingCounter++:t.loadingCounter--,t.loadingCounter>0?t.loading=!0:t.loading=!1},drawer:function(t,e){t.drawer=e},authenticate:function(t,e){t.favoriteMenuItems=e.user.favoriteMenuItems||{},localStorage.setItem("$aariXaFood$favoriteMenuItems",encodeURIComponent(r()(t.favoriteMenuItems))),delete e.user.favoriteMenuItems,t.authenticated=!0,t.token=e.id,t.user=e.user,t.isAdmin=e.user.roles.includes("Administrator"),t.isOfficeManager=e.user.roles.includes("OfficeManager"),i.a.cookie.set("$aariXaFood$token",e.id,{expires:e.ttl+"s"}),i.a.cookie.set("$aariXaFood$user",r()(e.user),{expires:e.ttl+"s"}),i.a.prototype.$axios.defaults.headers.common.Authorization=t.token},signOut:function(t){t.authenticated=!1,t.token=null,t.user=null,i.a.cookie.delete("$aariXaFood$token"),i.a.cookie.delete("$aariXaFood$user"),localStorage.clear(),delete i.a.prototype.$axios.defaults.headers.common.Authorization}}})},43:function(t,e,a){"use strict";e.a={data:function(){return{loginFormValid:!1,email:"@aariXa.be",emailDefault:"@aariXa.be",emailRules:[function(t){return!!t||"E-mail is vereist"},function(t){return/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(t)||"E-mail moet correct zijn"}],emailSent:!1,emailError:!1,sideMenuItems:[{icon:"dashboard",title:"Bestellingen",page:{name:"Root"}},{icon:"fastfood",title:"Leveranciers",page:{name:"Suppliers"}},{icon:"restaurant",title:"Keuken",page:{name:"Kitchen"}},{icon:"kitchen",title:"Koelkast",page:{name:"Fridge"}}],buildDateTime:"21/06/2018 23:39:12",clipped:!1,showBottomNav:!0,miniVariant:!1,fixed:!0,title:"aariXaFood"}},mounted:function(){this.loginWithCredentialsFromEmail(),this.$store.commit("drawer",!this.$store.state.authenticated)},methods:{sendLoginCredentialsEmail:function(t){var e=this;t.preventDefault(),this.emailSent=!1,this.emailError=!1,this.$refs.loginForm.validate()&&this.$axios.post("https://aarixafood.steffbeckers.eu/api/UserModels/login",{email:this.email}).then(function(t){"AUTH_EMAIL_SENT"===t.data.code&&(e.emailSent=!0)}).catch(function(){e.emailError=!0})},loginWithCredentialsFromEmail:function(){var t=this.$route.query.credentials;if(t){var e=atob(t);if("{"===e.charAt(0)&&"}"===e.charAt(e.length-1)){var a=JSON.parse(e);this.$store.commit("authenticate",a),this.$router.push({path:this.$route.query.redirect})}}},signOut:function(){var t=this;this.$axios.post("https://aarixafood.steffbeckers.eu/api/UserModels/logout").then(function(e){t.$store.commit("signOut"),t.email=t.emailDefault})}},computed:{firstLetterOfUser:function(){return this.$store.state.authenticated&&this.$store.state.user.username?this.$store.state.user.username.substr(0,1):""}},watch:{$route:function(t,e){this.showBottomNavActive="Root"===this.$route.name?0:1,this.loginWithCredentialsFromEmail()}},name:"App"}},44:function(t,e,a){t.exports=a.p+"static/img/aariXa_Shield_32x32.1dd4d61.png"},45:function(t,e,a){"use strict";e.a={name:"FourOhhFour"}}},[185]);
//# sourceMappingURL=app.b770f5b8327df5dafb69.js.map