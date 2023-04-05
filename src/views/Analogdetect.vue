<template>
    <!-- 骨架屏 -->
    <el-container id="skeleton-screen" v-show="isSubmittingQueryForm">
        <div style="width: 100%">
            <el-skeleton animated>
                <template #template>
                    <el-skeleton-item id="skeleton-height" variant="image" style="width: 100%; height: 100%" />
                </template>
            </el-skeleton>
        </div>
    </el-container>
    <div style="min-width:1500px;min-height:650px;" v-show="!isSubmittingQueryForm">
        <el-upload ref="upload" class="upload-demo" drag action="/addAutoVideo" style="width:500px;margin: auto;"
            :before-upload="beforeUploadVideo" :limit="1" :on-exceed="handleExceed" :on-success="handleSuccess">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    仅支持JPG、PNG、MP4格式
                </div>
            </template>
        </el-upload>

    </div>
</template>

<script lang="ts" setup>
import { Ref, ref, computed, watch, getCurrentInstance, ComponentInternalInstance, reactive, onMounted } from "vue";
import { compressAccurately } from 'image-conversion'
import { openSuccessMessage, removeElButtonFocus } from "@/composables/utilsFunction";
import { Plus, UploadFilled } from '@element-plus/icons-vue'
import { openErrorMessage, openWarningMessage, } from "@/composables/utilsFunction";
import { genFileId } from 'element-plus'
import { router } from "@/router";
import type { UploadFile, UploadProps, UploadInstance, UploadRawFile, UploadProgressEvent, UploadFiles } from 'element-plus'

// 骨架屏
const isSubmittingQueryForm: Ref<boolean> = ref(false);

// 添加活动展示照片,改变图片变化
const beforeUploadVideo: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    if (uploadFile.raw) {
        const isJPG = uploadFile.raw.type === "image/jpeg" || uploadFile.raw.type === "image/png" || uploadFile.raw.type === "image/jpg";
        const isMP4 = uploadFile.raw.type === "video/mp4";
        if (!isJPG && !isMP4) {
            openErrorMessage("只能是JPG、PNG、MP4格式!");
            uploadFiles.splice(-1, 1);
            return false;
        }
    }
    if (uploadFile.size) {
        const isLess5M = uploadFile.size / 1024 / 1024 < 25;
        if (!isLess5M) {
            openErrorMessage("上传文件大小不能超过 25MB!");
            uploadFiles.splice(-1, 1);//移除过大文件
            return false;
        }
    }
    openSuccessMessage("成功上传视频，请稍等片刻");// 骨架屏开关
    isSubmittingQueryForm.value = true; // 显示过渡画面
    // 全屏骨架屏
    var html = document.getElementById("skeleton-height");
    if (html !== null)
        html.style.height = String(document.documentElement.clientHeight - 75) + "px" // -75 为了减去导航栏显示小字
}

const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file)
}

const handleSuccess: UploadProps['onSuccess'] = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    const params = { resultdata: response };
    if (response.message === "成功检测，但是并无目标") {
        openSuccessMessage("成功检测，但是并无目标");
        uploadFiles.splice(-1, 1);//移除错误文件
        isSubmittingQueryForm.value = false;
    }
    else {
        router.push({
            // 跳转到结果页
            name: "Mapbox",
            state: { params },
        })

    }
}

// 骨架屏自适应高度
window.onresize = function () {
    var html = document.getElementById("skeleton-height");
    if (html !== null)
        html.style.height = String(document.documentElement.clientHeight - 75) + "px" // -75 为了减去导航栏显示小字
}

</script>

<style scoped>
/* 中间居中提交键 */
.middle-button {
    align-items: center;
    /* 设置子元素垂直居中*/
    display: flex;
    justify-content: center;
    padding-top: 30px;
    padding-bottom: 30px;
    /* 子元素水平居中 */
}

.middle-button-el {
    /* 不可以直接在按钮设置，因为类样式中设置的宽度将被覆盖 */
    height: 45px;
    width: 200px;
}

/* 视频框部分
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9 !important;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px !important;
  position: relative !important;
  overflow: hidden !important;
}
.avatar-uploader .el-upload:hover {
  border: 1px dashed #d9d9d9 !important;
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 300px;
  height: 178px;
  display: block;
} */
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
    height: 7px;
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
</style>