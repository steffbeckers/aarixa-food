webpackJsonp([5],{256:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a(276),n=a(288),r=a(27),i=r(s.a,n.a,!1,null,null,null);e.default=i.exports},276:function(t,e,a){"use strict";var s=a(28),n=a.n(s),r=a(0),i=a.n(r);e.a={data:function(){return{errors:[],dutyPeriodsList:JSON.parse(localStorage.getItem("kitchen:dutyPeriods"))||[],onDuty:JSON.parse(localStorage.getItem("kitchen:onDuty"))||null,search:"",rowsPerPageItems:[5,10,25,50,{text:"Alles",value:-1}],pagination:{sortBy:"startDate"},headers:[{text:"aariXiaan",align:"left",value:"userModel.username"},{text:"Van",align:"left",value:"startDate"},{text:"Tot",align:"left",value:"endDate"}]}},created:function(){this.listDutyPeriods()},methods:{listDutyPeriods:function(){var t=this,e={include:{relation:"userModel",scope:{fields:["id","username"]}},where:{endDate:{gte:i()().format("YYYY-MM-DD")}}};this.$axios.get("https://aarixafood.steffbeckers.eu/api/KitchenDuties?filter="+n()(e)).then(function(e){t.dutyPeriodsList=e.data,localStorage.setItem("kitchen:dutyPeriods",n()(t.dutyPeriodsList)),t.onDutyRightNow()}).catch(function(e){t.errors.unshift(e)})},onDutyRightNow:function(){for(var t=i()(),e=!1,a=0;a<this.dutyPeriodsList.length;a++){var s=this.dutyPeriodsList[a];i()(s.startDate)<=t&&t<=i()(s.endDate).add(1,"day")&&s.userModel&&s.userModel.username&&(this.onDuty=s.userModel.username,localStorage.setItem("kitchen:onDuty",n()(this.onDuty)),e=!0)}e||(this.onDuty=null)}},name:"Kitchen"}},288:function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("transition",{attrs:{name:"bounce"}},[a("v-container",{attrs:{"grid-list-lg":"",fluid:""}},[t.errors.length>0?a("v-layout",{attrs:{row:""}},[a("v-flex",t._l(t.errors,function(e,s){return a("v-alert",{key:s,attrs:{value:!0,type:"error"}},[t._v("\n          "+t._s(e.message)+"\n        ")])}))],1):t._e(),t._v(" "),a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:""}},[a("div",{staticClass:"title"},[t._v("Keuken")])]),t._v(" "),t.onDuty?a("v-flex",{attrs:{xs12:""}},[a("p",{staticClass:"mb-0"},[a("v-icon",[t._v("assignment_ind")]),t._v(" "+t._s(t.onDuty)+" staat deze week in voor de keuken.")],1)]):t._e()],1),t._v(" "),a("v-layout",{staticClass:"mt-0",attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{md6:"",xs12:""}},[a("v-text-field",{staticClass:"mb-2 pt-0 menuSearch",attrs:{"append-icon":"search",label:"Zoeken","single-line":"","hide-details":"",clearable:""},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}}),t._v(" "),a("v-data-table",{attrs:{headers:t.headers,items:t.dutyPeriodsList,loading:this.$store.state.loading,search:t.search,"disable-initial-sort":"",pagination:t.pagination,"rows-per-page-items":t.rowsPerPageItems,"rows-per-page-text":"Items per pagina:","no-results-text":"Geen resultaten gevonden.","no-data-text":"Er staat nog niets op de planning."},on:{"update:pagination":function(e){t.pagination=e}},scopedSlots:t._u([{key:"items",fn:function(e){return[a("td",[t._v(t._s(e.item.userModel.username))]),t._v(" "),a("td",[t._v(t._s(t._f("formatDate")(e.item.startDate)))]),t._v(" "),a("td",[t._v(t._s(t._f("formatDate")(e.item.endDate)))])]}},{key:"pageText",fn:function(e){var a=e.pageStart,s=e.pageStop,n=e.itemsLength;return[t._v("\n            "+t._s(a)+"-"+t._s(s)+" van "+t._s(n)+"\n          ")]}}])})],1)],1)],1)],1)},n=[],r={render:s,staticRenderFns:n};e.a=r}});
//# sourceMappingURL=5.2cbeebf1a2d2ba902839.js.map