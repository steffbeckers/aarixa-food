webpackJsonp([1],{112:function(t,e,n){"use strict";var a=n(250),o=n.n(a),s=n(252),i=n(255),r=n(259);e.a={name:"app",mounted:function(){this.loginWithCredentialsFromEmail()},computed:{menuIsOpen:{get:function(){return this.$store.state.splitter.open},set:function(t){this.$store.commit("splitter/toggle",t)}},authenticated:{get:function(){return this.$store.state.auth.authenticated},set:function(t){this.$store.commit("auth/set",t)}}},methods:{loginWithCredentialsFromEmail:function(){var t=this.$route.query.credentials;if(t){var e=atob(t);if("{"===e.charAt(0)&&"}"===e.charAt(e.length-1)){var n=JSON.parse(e);this.$cookie.set("$aariXaFood$token",n.id,{expires:n.ttl+"s"}),this.$cookie.set("$aariXaFood$user",o()(n.user),{expires:n.ttl+"s"}),this.$cookie.set("$aariXaFood$username",n.user.username,{expires:n.ttl+"s"}),this.$router.replace("/")}}}},components:{HomePage:s.a,MenuPage:i.a,LoginPage:r.a}}},113:function(t,e,n){"use strict";var a=n(84),o=n.n(a);e.a={name:"home",data:function(){return{pullHookState:"initial",orders:[1]}},methods:{loadOrders:function(t){var e=this;setTimeout(function(){e.orders=[].concat(o()(e.orders),[e.orders.length+1]),t()},500)}}}},114:function(t,e,n){"use strict";e.a={name:"navigation-menu"}},115:function(t,e,n){"use strict";var a=n(84),o=n.n(a);e.a={name:"login",data:function(){return{email:""}},methods:{login:function(){var t=this;setTimeout(function(){t.orders=[].concat(o()(t.orders),[t.orders.length+1])},200)}}}},116:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n(117),o=n.n(a),s=n(123),i=(n.n(s),n(125)),r=(n.n(i),n(126)),u=(n.n(r),n(66)),c=n(129),l=n.n(c),v=n(131),d=n(133),f=n(179),p=n(244),m=n(246),h=n(248);u.a.config.productionTip=!1,u.a.use(d.a),o()(f).forEach(function(t){return u.a.component(t.name,t)}),u.a.use(l.a),u.a.use(v.a),new u.a({el:"#app",store:p.a,router:m.a,template:"<App/>",components:{App:h.a}})},123:function(t,e){},125:function(t,e){},126:function(t,e){},132:function(t,e){},179:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n(180);n.d(e,"VOnsCard",function(){return a.a});var o=n(199);n.d(e,"VOnsCol",function(){return o.a});var s=n(201);n.d(e,"VOnsIcon",function(){return s.a});var i=n(203);n.d(e,"VOnsList",function(){return i.a});var r=n(205);n.d(e,"VOnsListHeader",function(){return r.a});var u=n(207);n.d(e,"VOnsListItem",function(){return u.a});var c=n(209);n.d(e,"VOnsListTitle",function(){return c.a});var l=n(211);n.d(e,"VOnsPage",function(){return l.a});var v=n(222);n.d(e,"VOnsPullHook",function(){return v.a});var d=n(224);n.d(e,"VOnsRow",function(){return d.a});var f=n(226);n.d(e,"VOnsSplitter",function(){return f.a});var p=n(234);n.d(e,"VOnsSplitterContent",function(){return p.a});var m=n(236);n.d(e,"VOnsSplitterMask",function(){return m.a});var h=n(238);n.d(e,"VOnsSplitterSide",function(){return h.a});var g=n(241);n.d(e,"VOnsToolbar",function(){return g.a});var _=n(242);n.d(e,"VOnsToolbarButton",function(){return _.a})},244:function(t,e,n){"use strict";var a=n(66),o=n(245);a.a.use(o.a),e.a=new o.a.Store({modules:{splitter:{namespaced:!0,state:{open:!1},mutations:{toggle:function(t,e){t.open="boolean"==typeof e?e:!t.open}}},auth:{namespaced:!0,state:{authenticated:!1},mutations:{set:function(t){"boolean"==typeof t&&(t.authenticated=t)}}}}})},246:function(t,e,n){"use strict";var a=n(66),o=n(247);a.a.use(o.a);var s=[];e.a=new o.a({routes:s})},248:function(t,e,n){"use strict";function a(t){n(249)}var o=n(112),s=n(262),i=n(57),r=a,u=i(o.a,s.a,!1,r,null,null);e.a=u.exports},249:function(t,e){},252:function(t,e,n){"use strict";function a(t){n(253)}var o=n(113),s=n(254),i=n(57),r=a,u=i(o.a,s.a,!1,r,"data-v-2c3be420",null);e.a=u.exports},253:function(t,e){},254:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-ons-page",[n("v-ons-toolbar",{staticClass:"home-toolbar"},[n("div",{staticClass:"left"},[n("v-ons-toolbar-button",{on:{click:function(e){t.$store.commit("splitter/toggle")}}},[n("v-ons-icon",{attrs:{icon:"fa-bars"}})],1)],1),t._v(" "),n("div",{staticClass:"center"},[t._v("aariXaFood")]),t._v(" "),n("div",{staticClass:"right",staticStyle:{"padding-right":"15px"},attrs:{"v-if":t.$cookie.get("$aariXaFood$token")}},[t._v("\n      "+t._s(t.$cookie.get("$aariXaFood$username"))+"\n    ")])]),t._v(" "),n("v-ons-pull-hook",{attrs:{action:t.loadOrders},on:{changestate:function(e){t.pullHookState=e.state}}},[n("span",{directives:[{name:"show",rawName:"v-show",value:"initial"===t.pullHookState,expression:"pullHookState === 'initial'"}]},[t._v(" Sleep om te vernieuwen ")]),t._v(" "),n("span",{directives:[{name:"show",rawName:"v-show",value:"preaction"===t.pullHookState,expression:"pullHookState === 'preaction'"}]},[t._v(" Loslaten ")]),t._v(" "),n("span",{directives:[{name:"show",rawName:"v-show",value:"action"===t.pullHookState,expression:"pullHookState === 'action'"}]},[t._v(" Laden ... ")])]),t._v(" "),n("v-ons-list-title",[t._v("Bestellingen")]),t._v(" "),n("v-ons-list",t._l(t.orders,function(e){return n("v-ons-list-item",{key:e},[t._v("\n      "+t._s(e)+"\n    ")])}))],1)},o=[],s={render:a,staticRenderFns:o};e.a=s},255:function(t,e,n){"use strict";function a(t){n(256)}var o=n(114),s=n(257),i=n(57),r=a,u=i(o.a,s.a,!1,r,"data-v-e96a2f08",null);e.a=u.exports},256:function(t,e){},257:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-ons-page",[a("v-ons-toolbar",{attrs:{modifier:"transparent"}}),t._v(" "),a("div",{staticClass:"header"},[a("img",{attrs:{src:n(258),alt:"aariXa Schild"}})]),t._v(" "),a("v-ons-list",[a("v-ons-list-item",{attrs:{modifier:"chevron"}},[a("div",{staticClass:"left"},[a("v-ons-icon",{attrs:{"fixed-width":"",icon:"fa-list-ul"}})],1),t._v(" "),a("div",{staticClass:"center"},[t._v("Bestellingen")])]),t._v(" "),a("v-ons-list-item",{attrs:{modifier:"chevron"}},[a("div",{staticClass:"left"},[a("v-ons-icon",{attrs:{"fixed-width":"",icon:"fa-sign-out"}})],1),t._v(" "),a("div",{staticClass:"center"},[t._v("Afmelden")])])],1)],1)},o=[],s={render:a,staticRenderFns:o};e.a=s},258:function(t,e,n){t.exports=n.p+"static/img/aariXa_Shield_1x1.9eb65a5.png"},259:function(t,e,n){"use strict";function a(t){n(260)}var o=n(115),s=n(261),i=n(57),r=a,u=i(o.a,s.a,!1,r,"data-v-2e1c3e4c",null);e.a=u.exports},260:function(t,e){},261:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-ons-page",[n("v-ons-toolbar",{staticClass:"login-toolbar"},[n("div",{staticClass:"center"},[t._v("aariXaFood")])])],1)},o=[],s={render:a,staticRenderFns:o};e.a=s},262:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-ons-page",{attrs:{id:"app"}},[n("v-ons-splitter",{attrs:{"v-if":t.authenticated}},[n("v-ons-splitter-side",{attrs:{swipeable:"",collapse:"",width:"250px",animation:t.$ons.platform.isAndroid()?"overlay":"reveal",open:t.menuIsOpen},on:{"update:open":function(e){t.menuIsOpen=e}}},[n("menu-page")],1),t._v(" "),n("v-ons-splitter-content",[n("home-page")],1)],1)],1)},o=[],s={render:a,staticRenderFns:o};e.a=s}},[116]);
//# sourceMappingURL=app.cfe394d762e429715115.js.map