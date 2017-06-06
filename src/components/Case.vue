<template>
  <div class="case">
    <header><a class="back" href="/#/record"><div class="arrow-left"><div class="arrow"></div></div></a>{{msg}}</header>
   <div class="casebox">
            <div class="casetop">
                <div class="time"><span class="date">{{ medical_list.date_info[0] }}</span><em>{{ medical_list.date_info[1] }}</em><span class="hour">{{ medical_list.date_info[2] }}</span></div>
                <div class="info">
                     <div class="person"><span class="name">{{ medical_list.patient_name }}</span><span class="sex">{{ medical_list.patient_sex }}</span><span class="age"><span v-if="medical_list.patient_age">{{ medical_list.patient_age? medical_list.patient_age+'岁' : '' }}</span></span><span class="fee" v-if="medical_list.total_price">&yen;{{ medical_list.total_price }}</span></div>
                     <div class="hospital"><span class="hospitalname">{{ medical_list.hospital }}</span><span class="department">{{ medical_list.department }}</span></div>
                     <div class="doctor"><span>主治医生：</span><em>{{ medical_list.doctor_name }}</em></div>
                </div>
            </div>
           <div class="casecenter">
                   <div id="J_NavList" class="ui-navigator">
                       <div class="ui-scroller">
                           <ul class="ui-navigator-list">
                               <li :class="{'ui-state-active':isActive}" @click='isActive=true;offActive=false;'><span>电子病例</span></li>
                               <li :class="{'ui-state-active':offActive}" @click='offActive=true;isActive=false;'><span>治疗明细</span></li>
                           </ul>
                       </div>
                   </div>
                   <div class="items-detail">
                       <div class="J_ItemDetail" v-if="isActive">
                           <div class="tit-con-box">
                               <h4 class="tit-box">主诉：</h4>
                               <div class="con-box">
                                  <div class="textbox">{{ reception.chiefComplaint }}</div>
                               </div>
                           </div>
                           <div class="tit-con-box">
                               <h4 class="tit-box">现病史：</h4>
                               <div class="con-box">
                                   <div class="textbox">{{ reception.historyOfPresentIllness }}</div>
                               </div>
                           </div>
                           <div class="tit-con-box">
                               <h4 class="tit-box">既往史：</h4>
                               <div class="con-box">
                                   <div class="nocon">{{ reception.pastHistory }}</div>
                               </div>
                           </div>
                           <div class="tit-con-box">
                               <h4 class="tit-box">检查：</h4>
                               <div class="con-box" v-for="item in checkList">
                                   
                                   <div class="textbox">{{ item.remark }}</div>
                               </div>
                           </div>
                           <div class="tit-con-box">
                               <h4 class="tit-box">诊断：</h4>
                               <div class="con-box" v-for="item in diagnosisList">
                                   <div class="tenimg">
                                       <div class="img_center ten-img-center" id="J_Toothtwo">
                                           <span class="horizontal-line"></span>
                                           <span class="vertical-line"></span>
                                           <span class="select-area top-left J_SelectArea0">{{ item.upperLeftTooth }}</span>
                                           <span class="select-area top-right J_SelectArea1">{{ item.upperRightTooth }}</span>
                                           <span class="select-area bottom-left J_SelectArea2">{{ item.lowerLeftTooth }}</span>
                                           <span class="select-area bottom-right J_SelectArea3">{{ item.lowerRightTooth }}</span>
                                       </div>
                                   </div>
                                   <div class="textbox">{{ item.remark }}</div>
                               </div>
                           </div>
                           <div class="tit-con-box">
                               <h4 class="tit-box">治疗计划：</h4>
                               <div class="con-box" v-for="item in planList">
                                   
                                   <div class="textbox">{{ item.remark }}</div>
                               </div>
                           </div>
                           <div class="tit-con-box">
                               <h4 class="tit-box">处理：</h4>
                               <div class="con-box" v-for="item in treatmentList">
                                   
                                   <div class="textbox">{{ item.remark }}</div>
                               </div>
                           </div>
                       </div>
                       <div class="J_ItemDetail" v-if="offActive">
                           <div class="tit-con-box" v-for="item in treatmentCharges">
                               <h4 class="tit-box">诊疗单：</h4>
                               <div class="con-box">
                                   <div class="small-tit-con">
                                       <span class="small-tit">单号：</span>
                                       <span class="small-con">{{ item.billNo }}</span>
                                   </div>
                                   <div class="small-tit-con">
                                       <span class="small-tit">缴费状态：</span>
                                       <span class="small-con">{{ item.chargeChild.chargeStatus == 1 ? '已缴费' : '未缴费'}}</span>
                                   </div>
                                   <div class="small-tit-con boders">
                                       <span class="small-tit">品名：</span>
                                       <span class="small-con">{{ item.chargeChild.itemName }}</span>
                                   </div>
                                   <div class="small-tit-con boders">
                                       <span class="small-tit">单位：</span>
                                       <span class="small-con">{{ item.chargeChild.itemUnitName }}</span>
                                   </div>
                                   <div class="small-tit-con boders">
                                       <span class="small-tit">数量：</span>
                                       <span class="small-con">{{ item.chargeChild.itemNum }}</span>
                                   </div>
                               </div>
                           </div>

                           <div class="tit-con-box" v-for="item in recipeCharges">
                               <h4 class="tit-box">处方单：</h4>
                               <div class="con-box">
                                   <div class="small-tit-con">
                                       <span class="small-tit">单号：</span>
                                       <span class="small-con">{{ item.billNo }}</span>
                                   </div>
                                   <div class="small-tit-con">
                                       <span class="small-tit">缴费状态：</span>
                                       <span class="small-con">{{ item.chargeChild.chargeStatus }}</span>
                                   </div>
                                   <div class="small-tit-con boders">
                                       <span class="small-tit">品名：</span>
                                       <span class="small-con">{{ item.chargeChild.itemName }}</span>
                                   </div>
                                   <div class="small-tit-con boders">
                                       <span class="small-tit">单位：</span>
                                       <span class="small-con">{{ item.chargeChild.itemUnitName }}</span>
                                   </div>
                                   <div class="small-tit-con boders">
                                       <span class="small-tit">用量：</span>
                                       <span class="small-con">{{ item.chargeChild.medicineDosage }}</span>
                                   </div>
                                   <div class="small-tit-con boders">
                                       <span class="small-tit">用药频率：</span>
                                       <span class="small-con">{{ item.childRecipe.medicineFrequency }}</span>
                                   </div>
                                   <div class="small-tit-con boders">
                                       <span class="small-tit">用法：</span>
                                       <span class="small-con">{{ item.childRecipe.medicineUsage }}</span>
                                   </div>
                               </div>
                           </div>
                           <div class="tit-con-box" v-for="item in radiateCharges">
                               <h4 class="tit-box">放射单：</h4>
                               <div class="con-box">
                                   <div class="small-tit-con">
                                       <span class="small-tit">单号：</span>
                                       <span class="small-con">{{ item.billNo }}</span>
                                   </div>
                                   <div class="small-tit-con">
                                       <span class="small-tit">缴费状态：</span>
                                       <span class="small-con">{{ item.chargeChild.chargeStatus }}</span>
                                   </div>
                                   <div class="small-tit-con boders">
                                       <span class="small-tit">拍片类型：</span>
                                       <span class="small-con">{{ item.radiate.radiographicContent }}</span>
                                   </div>
                                   <div class="small-tit-con boders">
                                       <span class="small-tit">牙片张数：</span>
                                       <span class="small-con">{{ item.radiate.radiographicNum }}</span>
                                   </div>
                                   <div class="small-tit-con">
                                       <span class="small-tit">拍摄牙位：</span>
                                       
                                       <div class="">
                                       	<div class="teeth_img">
												                    <img src="/static/img/teeth/all.png" class="all"/>
												                    <div v-for="itemUrl in handleImg(item.radiate.positinTooth)">
												                    	<div v-if="itemUrl"><img :src= 'baseUrl + itemUrl +".png"' :class="'tooth'+itemUrl"/></div>		    
												                    </div>
												                    
												                </div>
                                       </div>
                                   </div>


                               </div>
                           </div>
                       </div>
                   </div>
           </div>
           <div id="J_ErrorTip" class="error-tip"></div>
   </div>
    <MenuFooters :isHide="isHide" :menuType="currentMenuType"></MenuFooters>
  </div>
</template>
<script>
import axios from 'axios';
import { setSid, getSid } from '../utils/SidManager';
import getConfig from '../utils/config';
import {getUrl} from '../utils/WebRequest';
var config = getConfig();
import MenuFooters from './Footer'

  export default {
		name: 'Case',
		components: {
          MenuFooters
        },
		data() {
			return {
				msg: '电子病历',
				user: {sid: getSid(), medicalId: ''},
				isActive: true,
				offActive: false,
				baseUrl: '/static/img/teeth/',
				caseResult: {},
				reception: {},
				charge: {},
				checkList: {},
				diagnosisList: {},
				planList: {},
				treatmentList: {},
				treatmentCharges: {},
				recipeCharges: {},
				radiateCharges: {},
				medical_list: {},
				positionDate: {},
				currentMenuType: 'my',
                isHide:false
			}
		},

		methods: {
			handleImg: pos => {
					let arr = pos.replace(/t|\d[A-E]|,$/g, "").split(',');
								arr.forEach((v, k) => {
									if(v.length == 0) arr.splice(k,1);
									return arr;
								})
								
					return arr;
							
			},
			errorTip: function($target, tip) {
				$target.show();
				$target.text(tip);

				setTimeout(function() {
					$target.removeClass('error-tip');
					$target.addClass('error-tip-fade');

					setTimeout(function() {
						$target.removeClass('error-tip-fade');
						$target.addClass('error-tip');

						$target.hide();
					}, 500);
				}, 2000);
			},
			
			getCase: function() {
				var formData = JSON.stringify(this.user);

				//JSON.parse(formData))  ??post
				//'http://localhost:3000/case'
				//getUrl(config.url_map.getMedicalDetails), JSON.parse(formData)
				axios.post(getUrl(config.url_map.getMedicalDetails), JSON.parse(formData))
					.then(function(res) {
						if(res.data.status.error_code === 0) {
							this.caseResult = res.data.bizobj;
							this.medical_list = res.data.bizobj.medical_list;
							this.reception = res.data.bizobj.reception_detail;
							this.charge = res.data.bizobj.charge_detail;
							this.checkList = this.reception.checkList;
							this.diagnosisList = this.reception.diagnosisList;
							this.planList = this.reception.planList;
							this.treatmentList = this.reception.treatmentList;
							this.treatmentCharges = this.charge.treatmentCharges;
							this.recipeCharges = this.charge.recipeCharges;
							this.radiateCharges = this.charge.radiateCharges;				
							
						} else {
							this.errorTip($('#J_ErrorTip'), res.data.status.error_msg);
						}
					}.bind(this))
					.catch(function(err) {
						console.log(err);
					});
			}
		},

		created: function() {
		    let curMedicalId = '';

            if(window.location.href.indexOf('medicalId=') > -1){
                curMedicalId = window.location.href.substring(window.location.href.indexOf('medicalId=') + 10);
            }

            this.user.medicalId = curMedicalId;

			this.getCase();
		}
	}
</script>

