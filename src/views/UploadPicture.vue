<template>
    <!-- 全局预览图片 -->
    <div class="preview" v-show="showPic" @click="showPic = false">
        <div class="preview-show">
            <img :src="showPicUrl" alt="">
        </div>
    </div>
    <!-- 左边信息栏 -->
    <div class="left-box">
        <el-divider><el-icon><star-filled /></el-icon>基础信息</el-divider>
        <el-form :model="picForm" label-width="150px" label-position="left">
            <el-row class="form-row">
                <el-form-item label="坐标系选择">
                    <el-radio-group v-model="picForm.coorSysType">
                        <el-radio label="WGS84" border>大地坐标系</el-radio>
                        <el-radio label="GCJ02" border>高德坐标系</el-radio>
                        <el-radio label="Baidu" border>百度坐标系</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-row>

            <el-row class="form-row">
                <el-col :span="12">
                    <el-form-item label="纬度">
                        <el-input-number v-model="picForm.lat" :min="0" :max="90" style="width:160px" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="经度">
                        <el-input-number v-model="picForm.lng" :min="0" :max="180" style="width:160px" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="form-row">
                <el-form-item label="火源地理位置">
                    <el-cascader v-model="picForm.province" :options="cities" placeholder="请输入省市区县"
                        style="width: 390px;" separator="-" filterable :props="props" ref="cascader">
                        <template #default="{ node, data }">
                            <span style="float: left">{{ data.value }}</span>
                            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ data.code }}</span>
                        </template>
                    </el-cascader>
                </el-form-item>
            </el-row>
            <el-row class="form-row">
                <el-form-item label="发生时间范围">
                    <!-- <el-date-picker v-model="picForm.date" type="date" placeholder="Pick a day" /> -->
                    <el-date-picker v-model="picForm.period" range-separator="To" type="daterange" :clearable="false"
                        start-placeholder="Start Date" end-placeholder="End Date" :shortcuts="shortcuts" filterable />
                </el-form-item>
            </el-row>
            <el-divider><el-icon><star-filled /></el-icon>火灾描述</el-divider>
            <el-row class="form-row">
                <el-form-item label="火灾类型">
                    <el-radio-group v-model="picForm.fireType">
                        <el-radio label="forest" border>森林火灾</el-radio>
                        <el-radio label="building" border>建筑物火灾</el-radio>
                        <el-radio label="indoor" border>室内火灾</el-radio>
                        <el-radio label="other" border>其他火灾</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-row>
            <el-row class="form-row">
                <el-col :span="12">
                    <el-form-item label="火势强度">
                        <el-radio-group v-model="picForm.fireIntensity">
                            <el-radio-button label="small">小</el-radio-button>
                            <el-radio-button label="medium">中</el-radio-button>
                            <el-radio-button label="large">大</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="受害人数">
                        <el-input-number v-model="picForm.victim" :min="0" style="width:160px" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="form-row">
                <el-col :span="12">
                    <el-form-item label="消防队伍数量">
                        <el-input-number v-model="picForm.fireBrigade" :min="0" style="width:160px" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="财产损失">
                        <el-input-number v-model="picForm.money" :min="0" :step="100" style="width:160px" />
                        <div style="margin-left: 10px;">元</div>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider><el-icon><star-filled /></el-icon>周边气象条件</el-divider>
            <el-row class="form-row">
                <el-col :span="12">
                    <el-form-item>
                        <template #label>
                            <el-space :size="'small'">
                                <div>风速强度</div>
                                <el-popover :width="265"
                                    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 10px;">
                                    <template #reference>
                                        <el-avatar :icon="Info" />
                                    </template>
                                    <template #default>
                                        <p>使用Beaufort风力等级标准对风速进行量化描述，该标准是基于对人类、动物和自然环境的观察，它把风速分成12级</p>
                                        <p>具体标准为:</p>
                                        <p>0 - 无风; 1 - 软微风; 2 - 轻微风;3 - 轻风; 4 - 清风; 5 - 和风; 6 - 轻劲风; 7 - 劲风; 8 - 猛烈风; 9
                                            - 狂风; 10 - 暴风; 11 - 大暴风; 12 - 飓风</p>
                                    </template>
                                </el-popover>
                            </el-space>
                        </template>
                        <el-input-number v-model="picForm.beaufort" :min="0" :max='12' style="width:160px" />
                        <div style="margin-left: 10px;">级</div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="每天降雨量">
                        <el-input-number v-model="picForm.rainfall" :min="0" :step="3" style="width:160px" />
                        <div style="margin-left: 10px;">毫米</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="form-row">
                <el-col :span="12">
                    <el-form-item label="温度">
                        <el-input-number v-model="picForm.temperature" :min="-274" style="width:160px" />
                        <div style="margin-left: 10px;">摄氏度</div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="相对湿度">
                        <el-input-number v-model="picForm.humidity" :min="0" :max="100" :step="5" style="width:160px" />
                        <div style="margin-left: 10px;">%</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="form-row">
                <el-form-item label="风向">
                    <el-radio-group v-model="picForm.windDirection">
                        <el-radio-button label="north">北风</el-radio-button>
                        <el-radio-button label="south">南风</el-radio-button>
                        <el-radio-button label="west">西风</el-radio-button>
                        <el-radio-button label="east">东风</el-radio-button>
                        <el-radio-button label="northeast">东北风</el-radio-button>
                        <el-radio-button label="southeast">东南风</el-radio-button>
                        <el-radio-button label="southwest">西南风</el-radio-button>
                        <el-radio-button label="northwest">西北风</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-row>

        </el-form>

    </div>

    <!-- 中间间隔条 -->
    <!-- <div class="h_drag" style="cursor: e-resize;">
        <div class="tip">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
        </div>
    </div> -->

    <!-- 右边截图栏 -->
    <div class="right-box">
        <el-upload action="#" ref="elUpload" drag list-type="picture-card" :file-list="fileList"
            :class="{ disabled: uploadDisabled }" :auto-upload="false" :limit="1"
            accept="image/png, image/jpeg, image/jpg" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
            :on-change="handleChange">
            <el-icon class="avatar-uploader-icon">
                <Plus />
            </el-icon>
        </el-upload>
        <div class="cut">
            <!-- 展示图片 -->
            <!-- <img w-full :src="dialogImageUrl" alt="Preview Image" /> -->
            <div class="cropper">
                <vueCropper ref="cropper" :img="option.img" :outputSize="option.outputSize"
                    :outputType="option.outputType" :info="option.info" :canScale="option.canScale"
                    :autoCrop="option.autoCrop" :fixed="option.fixed" :fixedNumber="option.fixedNumber"
                    :full="option.full" :fixedBox="option.fixedBox" :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox" :original="option.original" :centerBox="option.centerBox"
                    :high="option.high" :infoTrue="option.infoTrue" :maxImgSize="option.maxImgSize"
                    :enlarge="option.enlarge" :mode="option.mode" />
            </div>

            <el-button-group style="margin:30px">
                <el-button type="primary" :icon="RefreshLeft" plain @click="rorateLeft($event)">左旋</el-button>
                <el-button type="primary" :icon="RefreshRight" plain @click="rorateRight($event)">右旋</el-button>
                <el-button type="primary" :icon="Plus" plain @click="changeScale(1, $event)">放大</el-button>
                <el-button type="primary" :icon="Minus" plain @click="changeScale(-1, $event)">缩小</el-button>
                <el-button type="primary" :icon="FullScreen" plain @click="finish($event)">预览</el-button>
                <el-button type="primary" :icon="Refresh" plain @click="handleReset($event)">复位</el-button>
                <el-button type="primary" :icon="Close" plain @click="handleModalCancel($event)">取消</el-button>
                <el-button type="primary" :icon="Check" plain @click="handleModalSure($event)">提交</el-button>
            </el-button-group>
        </div>
        <el-button type="primary" plain :icon="Search" @click="submitInfoButtonHandler($event)">提交搜索</el-button>
    </div>


    <!-- <el-dialog title="编辑头像" :visible.sync="dialogFormVisible" :close-on-click-modal="false" append-to-body>
        <label class="btn" for="uploads">选择图片</label>
        <input type="file" id="uploads" :value="imgFile" accept="image/png, image/jpeg, image/gif, image/jpg"
            @change="uploadImg($event, 1)">
        <div :class="show - preview">
            <div :class="preview">
                <img :src="previews.url">
            </div>
        </div>
        <div class="cut">
            <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType"
                :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox"
                :original="option.original" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight" :fixedBox="option.fixedBox" @realTime="realTime"
                @imgLoad="imgLoad"></vueCropper>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="finish('blob')" size="small">确 定</el-button>
        </div>
    </el-dialog> -->

</template>

<script lang="ts" setup>
import { Ref, ref, computed, watch, getCurrentInstance, ComponentInternalInstance, reactive, onMounted } from "vue";
import { optionInfo, PicForm } from "@/composables/baseTypes";
import { VueCropper } from "vue-cropper";
import axios from 'axios';
import 'vue-cropper/dist/index.css'
import { removeElButtonFocus } from "@/composables/utilsFunction";
import { Close, Plus, Minus, Check, RefreshRight, RefreshLeft, Refresh, FullScreen, Search, StarFilled } from '@element-plus/icons-vue'
import { openErrorMessage, openSuccessMessage, openWarningMessage } from "@/composables/utilsFunction";
import type { UploadFile, UploadProps, UploadInstance, UploadRawFile } from 'element-plus'
import { Info } from "@icon-park/vue-next";

const dialogImageUrl: Ref<string> = ref('')  // 原图片链接
const dialogVisible: Ref<boolean> = ref(false) // dialog框是否可见
const showPic: Ref<boolean> = ref(false)  // 预览图片是否可见
const showPicUrl: Ref<string> = ref('')  // 预览图片链接
const fileList: Ref<any> = ref([])
const dialogImgFile: Ref<UploadFile> = ref({ name: "", status: 'fail', uid: -1 } as UploadFile)  // 上传图片的原文件
const cropperImg: Ref<string> = ref('')  // 转换为blob图片链接
const { proxy } = getCurrentInstance() as ComponentInternalInstance;  //  as ComponetInternalInstance表示类型断言,使用getcurrentinstance代替使用this
// ctx和proxy都可以访问到定义的全局方法，但是ctx只能在本地使用，线上环境使用proxy

// 提交查询表单

const picForm = reactive(new PicForm(22.535, 113.931, 'WGS84', [new Date(), new Date()], 'other', 'medium', 0, ['广东省', '深圳市', '南山区'], 4, 'north', 0, 23, 40, 1, 0));
//配置信息
const option: Ref<optionInfo> = ref({
    img: "", // 裁剪图片的地址
    info: true, // 裁剪框的大小信息
    outputSize: 0.8, // 裁剪生成图片的质量
    outputType: "jpeg", // 裁剪生成图片的格式
    canScale: true, // 图片是否允许滚轮缩放
    autoCrop: true, // 是否默认生成截图框
    autoCropWidth: 224, // 默认生成截图框宽度,未使用,默认可以按照其余属性适应
    autoCropHeight: 224, // 默认生成截图框高度,未使用,默认可以按照其余属性适应
    fixedBox: false, // 固定截图框大小,不允许改变
    fixed: true, // 是否开启截图框宽高固定比例
    fixedNumber: [1, 1], // 截图框的宽高比例
    full: false, // 是否输出原图比例的截图
    canMove: true, // 上传图片是否可以移动
    canMoveBox: true, // 截图框能否拖动
    original: true, // 上传图片按照原始比例渲染
    centerBox: true, // 截图框是否被限制在图片里面
    high: false, // 是否按照设备的dpr,输出等比例图片
    infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
    maxImgSize: 3000,    //限制图片最大宽度和高度
    enlarge: 0.8,          //图片根据截图框输出比例倍数,不要太大不然会卡死
    mode: '100%',  //图片默认渲染方式,在裁剪时展现的图片,contain为容器内大小,100%为原大小，
})

// 快捷选择日期
const shortcuts = [{
    text: '一周间',
    value: () => {
        let today = new Date();
        let day = today.getDay() || 7; // Date.getDay()若为0 则返回7，否则返回星期几
        return [new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1 - day), new Date()]
    },
}, {
    text: '一月间',
    value: () => {
        const end = new Date()
        const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        return [start, end]
    }
},
{
    text: '一年间',
    value: () => {
        const end = new Date()
        const start = new Date(new Date().getFullYear(), 0)
        return [start, end]
    },
},
{
    text: '昨天开始',
    value: () => {
        return [new Date().setTime(new Date().getTime() - 3600 * 1000 * 24), new Date()]
    },
},
{
    text: '一周前开始',
    value: () => {
        return [new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()]
    },
},
{
    text: '一月前开始',
    value: () => {
        const end = new Date()
        const start = new Date()
        start.setMonth(start.getMonth() - 1)
        return [start, end]
    },
},
{
    text: '三月前开始',
    value: () => {
        const end = new Date()
        const start = new Date()
        start.setMonth(start.getMonth() - 3)
        return [start, end]
    },
}]

// 城市json
const cities = require("@/assets/province/province_area.json");

// 级联选择器碰到后展开
const props = {
    expandTrigger: 'hover' as const,
}

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    dialogImageUrl.value = ""
    // console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}

// // 当超出限制时，执行的钩子函数
// const upload = ref<UploadInstance>();
// const handleExceed: UploadProps['onExceed'] = (files) => {
//     upload.value!.clearFiles()
//     const file = files[0] as UploadRawFile
//     file.uid = genFileId()
//     upload.value!.handleStart(file)
// }

// 添加活动展示照片,改变图片变化
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    console.log("upload")
    if (uploadFile.raw) {
        const isJPG = uploadFile.raw.type === "image/jpeg" || uploadFile.raw.type === "image/png";
        if (!isJPG) {
            openErrorMessage("上传头像图片只能是 JPG 、png 格式!");
            uploadFiles.splice(-1, 1);//移除错误文件
            return false;
        }
    }
    if (uploadFile.size) {
        const isLess5M = uploadFile.size / 1024 / 1024 < 5;
        if (!isLess5M) {
            openErrorMessage("上传头像图片大小不能超过 5MB!");
            uploadFiles.splice(-1, 1);//移除过大文件
            return false;
        }
    }
    // 图片文件及属性均存在继续赋值
    if (uploadFile) {
        console.log("file-list")
        console.log(fileList.value)
        dialogImgFile.value = uploadFile;
        if (uploadFile.raw)
            cropperChange(uploadFile.raw);
        if (uploadFile.url)
            dialogImageUrl.value = uploadFile.url;
    }

    if (proxy)
        (proxy.$refs.elUpload as any).clearFiles() // 清除el-upload图片
    dialogImageUrl.value = ''  // upload图标保持不变，只有点击提交才放入
}

// 转换为blob
const cropperChange = (file: UploadRawFile) => {
    var reader = new FileReader();
    reader.onload = e => {
        let data;
        if (e.target) {
            if (typeof e.target.result === 'object') {
                // 把Array Buffer转化为blob 如果是base64不需要
                data = window.URL.createObjectURL(new Blob([e.target.result as ArrayBuffer]));
            } else {
                data = e.target.result;
            }
        }
        if (typeof data === "string") {
            cropperImg.value = data;
            option.value.img = data;
        }

    };
    // 转化为base64
    // reader.readAsDataURL(file)
    // 转化为blob
    reader.readAsArrayBuffer(file);
    // 弹窗视为可见
    dialogVisible.value = true;
}

// 一个计算属性 ref, 绑定只有一张图片时，加号不可见
const uploadDisabled = computed(() => {
    return dialogImageUrl.value !== "";
})
// 监视
// const uploadDisabled: Ref<boolean> = ref(false)
// watch(dialogImageUrl, () => {
//     if (dialogImageUrl.value !== "")
//         uploadDisabled.value = true;
//     else
//         uploadDisabled.value = false;
// },
//     { deep: true })


// 操作：旋转
const rorateImg = async (num: number) => {
    if (proxy)
        (proxy.$refs.cropper as any).rotateTo((num % 4) * 90); // 设置旋转一次的幅度为 90°
}

const rorateLeft = (event: Event) => {
    if (proxy)
        (proxy.$refs.cropper as any).rotateLeft();
    removeElButtonFocus(event);
}

const rorateRight = (event: Event) => {
    if (proxy)
        (proxy.$refs.cropper as any).rotateRight();
    removeElButtonFocus(event);
}

//图片缩放
const changeScale = (num: number, event: Event) => {
    if (proxy)
        (proxy.$refs.cropper as any).changeScale(num)
    removeElButtonFocus(event);
}

// 预览
const finish = (event: Event) => {
    if (proxy) {
        (proxy.$refs.cropper as any).getCropBlob((data: Blob) => {
            var img = window.URL.createObjectURL(data);
            showPic.value = true;
            showPicUrl.value = img;
        })
    }
    removeElButtonFocus(event);
}

// 复位
const handleReset = (event: Event) => {
    if (proxy)
        (proxy.$refs.cropper as any).refresh()
    removeElButtonFocus(event);
}

// 取消
const handleModalCancel = (event: Event) => {
    option.value.img = ""
    dialogImageUrl.value = ""
    if (proxy)
        (proxy.$refs.elUpload as any).clearFiles() // 清除el-upload图片
    dialogImgFile.value = { name: "", status: 'fail', uid: -1 }
    dialogVisible.value = false;
    removeElButtonFocus(event);
}

// 提交
const handleModalSure = (event: Event) => {
    if (proxy)
        (proxy.$refs.cropper as any).getCropBlob((data: Blob) => { // 获取当前裁剪好的数据
            console.log(data)
            // fileList.value.push({name: "cut_pic.jpg",url: window.URL.createObjectURL(data)});
            // data是一个Blob数据，部分接口接收的是File转化的FormData数据
            let formData = new FormData();
            formData.append('image', data, 'cut_pic.jpg');
            // 调用axios上传
            axios.post("./assets/upload_pic", formData).then((response) => {
                console.log('response', response);
                //   const res = response.data;
                //   if (res.code == 0) {
                // 	  this.$message.success('剪裁上传成功');
                // 	  this.$emit('saveImage', res.result.url);
                //   } else {
                // 	  this.$message.error('剪裁上传失败');
                //   }
            });
            // formData.append(
            //     "file",
            //     new File(
            //         [data], // 将Blob类型转化成File类型
            //         "pic.jpg", // 设置File类型的文件名称
            //         { type: data.type } // 设置File类型的文件类型
            //     )
            // );
            // console.log(formData)
            // // 调用接口上传
            // upLoadFile(formData).then(result => {
            //     console.log(result)
            //     this.dialogVisible = false;
            // })

            //第三个参数是规定以什么为后缀，接口是根据后缀来返回地址格式的
            // formData.append("file", data,'chris.jpg');
            //   //上传接口
            // uploadApi(formData).then(res=>{})
        })
    removeElButtonFocus(event);
}

// 提交搜索
const submitInfoButtonHandler = (event: Event) => {
    console.log(picForm)
    removeElButtonFocus(event);
}

</script>

<style scoped>
/* 裁剪框 */
.cropper {
    width: 95%;
    height: 400px;
    margin-left: 30px;
    margin-right: 30px;
    /* text-align: center; */
    /* margin: 30px auto;
    justify-content: center;
    align-items: center; */
}

/* 右边剪切框整体 */
.cut {
    margin: 20px;
    width: 700px;
    height: 500px;
    text-align: center;
}

/* 表单每行样式 */
.form-row {
    margin-top: 10px;
    margin-left: 25px;
}

/* 提示图标信息 */
.el-avatar--default {
    --el-avatar-size: 20px;
}

.el-avatar {
    --el-avatar-text-color: #000;
    --el-avatar-bg-color: #fff;
}

/* 中间间隔 */
/* .h_drag {
    width: 6px;
    height: 100%;
    line-height: 100%;
    background-color: #212324;
    overflow: hidden;
    position: relative;
    float: left;
}

.h_drag .tip {
    height: 20px;
    display: inline;
    position: absolute;
    top: 40%;
}

.h_drag .line {
    width: 1px;
    height: 80px;
    margin-left: 1px;
    background-color: #333;
    float: left;
} */

/*
.button-foot {
    margin: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;

}

.modal-foot-contain {
    display: flex;
    align-items: center;
}

.modal-foot-btn {
    width: 112px;
    height: 40px;
    margin: 0 8px;
    border-radius: 6px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
    cursor: pointer;
} */

/* 全局预览 */
.preview {
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
}

/* 全局预览 */
.preview-show {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
}

/* 左边盒子 */
.left-box {
    display: block;
    float: left;
    height: 100%;
    width: 49%;
    margin-left: 10px;
    border: solid 1px var(--el-border-color);
}

/* 右边盒子 */
.right-box {
    display: block;
    float: right;
    height: 100%;
    width: 49%;
    margin-right: 10px;
    border: solid 1px var(--el-border-color);
}
</style>

<style>
/* 在有图片时不在显示加号 */
.disabled .el-upload.el-upload--picture-card {
    display: none !important;
}

/* 禁止拖动变蓝 */
body {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 7px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}

::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
    background: #909399;
}

::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
    border-radius: 10px;
    background: #ededed;
}

/* 日期选择侧边宽度 */
.el-picker-panel__sidebar {
    width: 130px;
}

/* 分割线文字 */
.el-divider__text {
    font-size: 16px
}

/* 分割线上下宽度 */
.el-divider--horizontal {
    margin: 20px 0;
}

/* dialog关闭键按钮*/
/*.el-dialog__headerbtn .el-dialog__close {
    font-size: 30px;
    color: #333;
}

.el-dialog__body {
    margin: 30px;
    height: 500px;
} */
</style>