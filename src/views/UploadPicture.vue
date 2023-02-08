<template>
    <p>上传</p>
    <el-upload action="#" ref="elUpload" drag list-type="picture-card" :class="{ disabled: uploadDisabled }" :auto-upload="false" :limit="1"
        accept="image/png, image/jpeg, image/jpg" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="handleChange">
        <el-icon class="avatar-uploader-icon">
            <Plus />
        </el-icon>
    </el-upload>

    <el-dialog v-model="dialogVisible">
        <!--  :close-on-click-modal：默认true，表示点击dialog外面可以关闭 -->
        <!-- 展示图片 -->
        <!-- <img w-full :src="dialogImageUrl" alt="Preview Image" /> -->

        <!-- <div slot="footer" class="dialog-footer">
            <el-button>取 消</el-button>
            <el-button type="primary">确 定</el-button>
        </div> -->
        <div>
            <div class="cropper">
                <vueCropper ref="cropper" :img="option.img" :outputSize="option.outputSize"
                    :outputType="option.outputType" :info="option.info" :canScale="option.canScale"
                    :autoCrop="option.autoCrop" :fixed="option.fixed" :fixedNumber="option.fixedNumber"
                    :full="option.full" :fixedBox="option.fixedBox" :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox" :original="option.original" :centerBox="option.centerBox"
                    :high="option.high" :infoTrue="option.infoTrue" :maxImgSize="option.maxImgSize"
                    :enlarge="option.enlarge" :mode="option.mode" />
            </div>
            <!-- @finishUploadEvent="finishUploadEvent" -->
            <!-- 尝试换el-button -->
            <div class="modal-foot">
                <div class="modal-foot-contain">
                    <div class="modal-foot-btn" @click="rorateLeft()">左旋</div>
                    <div class="modal-foot-btn" @click="rorateRight()">右旋</div>
                </div>
                <div class="modal-foot-contain">
                    <div class="modal-foot-btn" @click="handleModalSure()">提交</div>
                    <div class="modal-foot-btn" @click="handleModalCancel()">取消</div>
                </div>
            </div>
        </div>
        <!-- <div class="footer-btn">
            <div class="scope-btn">
                <el-button size="mini" type="danger" plain icon="el-icon-zoom-in" @click="changeScale(1)">放大</el-button>
                <el-button size="mini" type="danger" plain icon="el-icon-zoom-out"
                    @click="changeScale(-1)">缩小</el-button>
                <el-button size="mini" type="danger" plain @click="rotateLeft">↺ 左旋转</el-button>
                <el-button size="mini" type="danger" plain @click="rotateRight">↻ 右旋转</el-button>
            </div>
            <div class="upload-btn">
                <el-button size="mini" type="success" @click="uploadImg('blob')">上传封面 <i
                        class="el-icon-upload"></i></el-button>
            </div>
        </div> -->
    </el-dialog>

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
import { Ref, ref, computed, watch, getCurrentInstance, ComponentInternalInstance } from "vue";
import { optionInfo } from "@/composables/baseTypes";
import { VueCropper } from "vue-cropper";
import 'vue-cropper/dist/index.css'
import { ElMessage, genFileId } from 'element-plus'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { openErrorMessage, openSuccessMessage, openWarningMessage } from "@/composables/utilsFunction";
import type { UploadFile, UploadProps, UploadInstance, UploadRawFile } from 'element-plus'

const dialogImageUrl: Ref<string> = ref('')  // 原图片链接
const dialogVisible: Ref<boolean> = ref(false) // dialog框是否可见
const dialogImgFile: Ref<UploadFile> = ref({ name: "", status: 'fail', uid: -1 } as UploadFile)  // 上传图片的原文件
const cropperImg: Ref<string> = ref('')  // 转换为blob图片链接
const { proxy } = getCurrentInstance() as ComponentInternalInstance;  //  as ComponetInternalInstance表示类型断言,使用getcurrentinstance代替使用this
// ctx和proxy都可以访问到定义的全局方法，但是ctx只能在本地使用，线上环境使用proxy

// const elUpload: Ref<HTMLDivElement | null> = ref(null);

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
        dialogImgFile.value = uploadFile;
        if (uploadFile.raw)
            cropperChange(uploadFile.raw);
        if (uploadFile.url)
            dialogImageUrl.value = uploadFile.url;
    }
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
        (proxy.$refs.cropper as any).rotateTo((num% 4) * 90); // 设置旋转一次的幅度为 90°
}

const rorateLeft = () => {
    if (proxy)
        (proxy.$refs.cropper as any).rotateLeft();
}

const rorateRight = () => {
    if (proxy)
        (proxy.$refs.cropper as any).rotateRight();
}

// 操作：裁剪框-确定
const handleModalSure = async () => {
    // if (state.onLoading) return
    // state.onLoading = true
    // // 获取生成的base64图片地址
    // const base64 = cropper.getDataURL()
    // // 获取生成的blob文件信息
    // const blob = await cropper.getBlob()
    // // 获取生成的file文件信息
    // const file = await cropper.getFile({
    //     // fileName: '测试文件名，可不传'
    // })
    // // console.log({ base64, blob, file })
    // // 把base64赋给结果展示区
    // result.dataURL = base64
    // try {
    //     result.blobURL = URL.createObjectURL(blob)
    // } catch (e) {
    //     result.blobURL = ''
    // }
    // context.emit('handleModalSure', file)
    // state.displayCropModal = false
    // state.onLoading = false
}

// 操作：裁剪框-取消
const handleModalCancel = () => {
    // context.emit('handleModalCancel')
    // state.displayCropModal = false
    dialogImageUrl.value = ""
    if (proxy)
        (proxy.$refs.elUpload as any).clearFiles() // 清除el-upload图片
    dialogImgFile.value = { name: "", status: 'fail', uid: -1 }
    dialogVisible.value = false;
}

</script>

<style scoped>
.cropper {
    /* width: 300px; */
    height: 400px;
    /* text-align: center; */
    /* margin: 30px auto;
    justify-content: center;
    align-items: center; */
}

.vue-cropper {
    text-align: center;
}


.modal-foot {
    margin-top: 30px;
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
}
</style>

<style>
/* 在有图片时不在显示加号 */
.disabled .el-upload.el-upload--picture-card {
    display: none !important;
}

/* dialog关闭键按钮 */
.el-dialog__headerbtn .el-dialog__close {
    font-size: 30px;
    color: #333;
}

.el-dialog__body {
    margin: 30px;
    height: 500px;
}
</style>