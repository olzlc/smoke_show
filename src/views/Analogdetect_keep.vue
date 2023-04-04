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
    <div style="min-width:1500px;min-height:650px" v-show="!isSubmittingQueryForm">
        <el-upload action="#" ref="elUpload" drag list-type="picture-card" :file-list="fileList"
            :class="{ disabled: uploadDisabled }" :auto-upload="false" :limit="1"
            accept="image/png, image/jpeg, image/jpg, video/mp4"
            :on-remove="handleRemove" :on-change="handleChange">
            <el-icon class="avatar-uploader-icon">
                <Plus />
            </el-icon>
        </el-upload>
        
        <div style="padding-left: 10px;padding-right: 10px;">
            <div class='middle-button'>
                <el-button type="primary" plain :icon="Plus" class="middle-button-el"
                    style="height: 45px;padding-left: 45px;padding-right: 45px;"
                    @click="submitInfoButtonHandler($event)">提交信息</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Ref, ref, computed, watch, getCurrentInstance, ComponentInternalInstance, reactive, onMounted } from "vue";
import { VueCropper } from "vue-cropper";
import axios from 'axios';
import 'vue-cropper/dist/index.css'
import { compressAccurately } from 'image-conversion'
import { removeElButtonFocus } from "@/composables/utilsFunction";
import { Close, Plus, Minus, Check, RefreshRight, RefreshLeft, Refresh, FullScreen, StarFilled } from '@element-plus/icons-vue'
import { openErrorMessage, openSuccessMessage, openWarningMessage } from "@/composables/utilsFunction";
import type { UploadFile, UploadProps, UploadInstance, UploadRawFile } from 'element-plus'
import { Info } from "@icon-park/vue-next";
import { shortcuts, cities } from "@/composables/form-page/initForm";
import setupForm from "@/composables/form-page/initForm";
import postForm from "@/composables/submit/submitForm";
import { getLatLngTencent } from "@/composables/map-api/tencentMapApi"
import { LocationPoint } from "@/composables/baseTypes";

const dialogImageUrl: Ref<string> = ref('')  // 原图片链接
const dialogImgFile: Ref<UploadFile> = ref({} as UploadFile); // 上传图片的原文件
const fileList: Ref<any> = ref([])
const { proxy } = getCurrentInstance() as ComponentInternalInstance;  // 类型断言,使用getcurrentinstance代替使用this
// ctx和proxy都可以访问到定义的全局方法，但是ctx只能在本地使用，线上环境使用proxy

// 初始化查询表单和裁剪框设置
const { option, picForm } = setupForm();

// 骨架屏
const isSubmittingQueryForm: Ref<boolean> = ref(false);

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    dialogImageUrl.value = ""
    fileList.value = []
    dialogImgFile.value = { name: "", status: 'fail', uid: -1 }
    option.value.img = ''
    // console.log(uploadFile, uploadFiles)
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
            option.value.img = data;
        }

    };
    // 转化为base64
    // reader.readAsDataURL(file)
    // 转化为blob
    reader.readAsArrayBuffer(file);
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


// 提交搜索
const submitInfoButtonHandler = (event: Event) => {
    console.log(picForm)
    if (picForm.victim === null || picForm.victim === undefined
        || picForm.money === null || picForm.money === undefined || picForm.humidity === null
        || picForm.humidity === undefined || picForm.rainfall === null || picForm.rainfall === undefined
        || picForm.temperature === null || picForm.temperature === undefined || picForm.beaufort === null
        || picForm.beaufort === undefined || picForm.fireBrigade === null || picForm.fireBrigade === undefined) {
        openErrorMessage("请完善表单信息");
        removeElButtonFocus(event);
        return
    }
    if (picForm.province[0] === null || picForm.province[0] === undefined || picForm.province[0] === ''
        || picForm.province[1] === null || picForm.province[1] === undefined || picForm.province[1] === '') {
        openErrorMessage("请完善表单信息");
        removeElButtonFocus(event);
        return
    }

    if (dialogImageUrl.value === '') {
        openErrorMessage("请选择一张图片再提交信息");
        removeElButtonFocus(event);
        return
    }

    if (proxy) {
        (proxy.$refs.cropper as any).getCropBlob((data: Blob) => { // 获取当前裁剪好的数据
            // 压缩图片到1m以下
            const res = compressAccurately(data, {
                size: 1000, //需要压缩的大小
                accuracy: 0.80, //精度 0.8-0.99之间 默认值0.95
                scale: 0.5,
            }).then(res => {
                var compressed_file = new File([res], dialogImgFile.value.name, { type: dialogImgFile.value.raw!.type });
                // 处理经纬度为7位小数
                picForm.lat.toFixed(7);
                picForm.lng.toFixed(7);
                // 地址自动加上省市区
                picForm.address = `${picForm.province[0]}${picForm.province[1]}${picForm.province[2]}` + picForm.address
                const formData = new FormData();
                formData.append("picForm", JSON.stringify(picForm));
                formData.append("file", compressed_file);
                // 调用接口上传
                postForm(formData, isSubmittingQueryForm);
            })

        })
    }

    // 全屏骨架屏
    var html = document.getElementById("skeleton-height");
    if (html !== null)
        html.style.height = String(document.documentElement.clientHeight - 75) + "px" // -75 为了减去导航栏显示小字
    removeElButtonFocus(event);
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
<!-- 要上传视频，您可以使用Vue的Axios库来向服务器发送POST请求，同时将视频文件作为FormData附加到请求中。以下是一个示例代码块：

```javascript
<template>
  <div>
    <input type="file" ref="fileInput" @change="uploadVideo">
  </div>
</template>

<script>
import axios from 'axios'

export default {
  methods: {
    async uploadVideo() {
      const formData = new FormData()
      formData.append('video', this.$refs.fileInput.files[0])
      try {
        const response = await axios.post('/upload', formData)
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
```

在Flask中，您可以使用Flask的request对象来接收上传的视频文件。以下是一个示例代码块：

```python
from flask import Flask, request

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_video():
    video_file = request.files['video']
    video_file.save('/path/to/save/video')
    return 'Video uploaded successfully'

if __name__ == '__main__':
    app.run()
```
在这个示例中，我们使用Flask的request对象获取上传的视频文件，并使用save()方法将其保存到指定的路径下。

 -->