webpackJsonp([4],{257:function(e,t,a){"use strict";function s(e){a(285)}Object.defineProperty(t,"__esModule",{value:!0});var r=a(277),n=a(287),i=a(27),o=s,l=i(r.a,n.a,!1,o,"data-v-18aa7180",null);t.default=l.exports},277:function(e,t,a){"use strict";var s=a(28),r=a.n(s),n=a(0),i=a.n(n);t.a={data:function(){return{errors:[],suppliers:JSON.parse(localStorage.getItem("suppliers"))||[],dayOfWeek:(new Date).getDay()}},created:function(){this.listSuppliers()},methods:{listSuppliers:function(){var e=this;this.$axios.get("https://aarixafood.steffbeckers.eu/api/Suppliers").then(function(t){e.suppliers=t.data,localStorage.setItem("suppliers",r()(e.suppliers))}).catch(function(t){e.errors.unshift(t)})},navigateToSupplier:function(e){this.$router.push({name:"SupplierDetail",params:{slug:e}})},supplierOpen:function(e){var t=!1,a=i()();return e.forEach(function(e){var s=i()(e.from,"HH:mm"),r=i()(e.until,"HH:mm");a.isBetween(s,r)&&(t=!0)}),t}},name:"Suppliers"}},285:function(e,t,a){var s=a(286);"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);a(255)("5bee4ab5",s,!0,{})},286:function(e,t,a){t=e.exports=a(254)(!0),t.push([e.i,".card__media[data-v-18aa7180],.card__title[data-v-18aa7180]{cursor:pointer}","",{version:3,sources:["C:/dev/aariXaFood/client/src/pages/Suppliers.vue"],names:[],mappings:"AACA,4DAEE,cAAgB,CACjB",file:"Suppliers.vue",sourcesContent:["\n.card__media[data-v-18aa7180],\n.card__title[data-v-18aa7180] {\n  cursor: pointer;\n}\n"],sourceRoot:""}])},287:function(e,t,a){"use strict";var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("transition",{attrs:{name:"bounce"}},[a("v-container",{attrs:{"grid-list-lg":"",fluid:""}},[e.errors.length>0?a("v-layout",{attrs:{row:""}},[a("v-flex",e._l(e.errors,function(t,s){return a("v-alert",{key:s,attrs:{value:!0,type:"error"}},[e._v("\n          "+e._s(t.message)+"\n        ")])}),1)],1):e._e(),e._v(" "),a("v-layout",{attrs:{row:""}},[a("v-flex",[a("div",{staticClass:"title"},[e._v("Leveranciers")])])],1),e._v(" "),a("v-layout",{attrs:{row:"",wrap:""}},e._l(e.suppliers,function(t){return a("v-flex",{key:t.id,attrs:{xl3:"",lg4:"",sm6:"",xs12:""}},[a("v-card",[t.slug?a("v-img",{attrs:{src:"/static/img/suppliers/"+t.slug+"/1_min.jpg",height:"150px"},on:{click:function(a){return e.navigateToSupplier(t.slug)}}}):e._e(),e._v(" "),a("v-card-title",{attrs:{"primary-title":""},on:{click:function(a){return e.navigateToSupplier(t.slug)}}},[a("div",[a("h3",{staticClass:"headline mb-1"},[e._v(e._s(t.name))]),e._v(" "),a("div",[t.telephone?a("span",{staticClass:"telephone"},[e._v(e._s(t.telephone))]):e._e(),e._v(" "),t.telephone&&t.website?a("span",[e._v(" - ")]):e._e(),e._v(" "),t.website?a("span",{staticClass:"website"},[e._v(e._s(e._f("formatWebsite")(t.website)))]):e._e()]),e._v(" "),t.openingHours&&t.openingHours[e.dayOfWeek]?a("div",e._l(t.openingHours[e.dayOfWeek],function(t,s){return a("span",{key:s},[s>0?a("span",[e._v("& ")]):e._e(),e._v(e._s(t.from)+" - "+e._s(t.until)+"\n                ")])}),0):e._e()])]),e._v(" "),a("v-card-actions",[t.telephone?a("v-btn",{attrs:{href:"tel:"+t.telephone,flat:""}},[e._v("\n              Bellen\n            ")]):e._e(),e._v(" "),t.website?a("v-btn",{attrs:{href:t.website,target:"_blank",flat:""}},[e._v("\n              Website\n            ")]):e._e(),e._v(" "),t.address&&t.address.googleMapsLink?a("v-btn",{attrs:{href:t.address.googleMapsLink,target:"_blank",flat:""}},[e._v("\n              Maps\n            ")]):e._e()],1)],1)],1)}),1)],1)],1)},r=[],n={render:s,staticRenderFns:r};t.a=n}});
//# sourceMappingURL=4.d62a8d4df952f76d06ab.js.map