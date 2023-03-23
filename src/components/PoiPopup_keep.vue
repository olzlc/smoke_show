<template>
  <!-- 全局预览图片 -->
  <div class="preview" v-show="showPic" @click="hideFullScreen">
    <div class="preview-show">
      <img v-if="isBase64(picData.image_data)" ref="fullScreenImg" :src="getBase64(picData.image_data)" @click="hideFullScreen">
      <img v-else :src="require('@/assets/images/' + picData.image_data)" ref="fullScreenImg" @click="hideFullScreen">
    </div>
  </div>

  <div class="demo-image__preview">
    <!-- <img :src="require('../assets/images/' + picData.picName)" width='112' height='112'/> -->
    <el-image v-if="isBase64(picData.image_data)" :src="getBase64(picData.image_data)" fit="fill"
      style="width: 112px; height: 112px" @click="showFullScreen">
      <!-- fit:图片如何适应容器框,src:图片链接,preview-src-list:大图预览链接，需要数组,preview-teleported:插入至body元素上 -->
      <!-- 加载失败内容 -->
      <div slot="placeholder">未加载是显示的内容</div>
      <div slot="error" class="image-slot">
        <el-image fit="cover" src="require('@/assets/images/000000.jpg')" />
      </div>
    </el-image>
    <el-image v-else :src="require('@/assets/images/' + picData.image_data)" fit="fill"
      style="width: 112px; height: 112px" @click="showFullScreen">
      <!-- fit:图片如何适应容器框,src:图片链接,preview-src-list:大图预览链接，需要数组,preview-teleported:插入至body元素上 -->
      <!-- 加载失败内容 -->
      <div slot="placeholder">未加载是显示的内容</div>
      <div slot="error" class="image-slot">
        <el-image fit="cover" src="require('@/assets/images/000000.jpg')" />
      </div>
    </el-image>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref, nextTick, onMounted, ComponentInternalInstance, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const showPic: Ref<boolean> = ref(false)  // 预览图片是否可见
/**
 * 这一页设计的是地图poi气泡的样式
 */
const picData = defineProps<{
  image_data: string;
}>();

function isBase64(str: string) {
  if (str === '' || str.trim() === '') {
    return false;
  }
  try {
    return btoa(atob(str)) == str;
  } catch (err) {
    return false;
  }
}

function getBase64(base64: string) {
  return ('data:image/png;base64,' + base64).replace(/[\r\n]/g, '')
}

function showFullScreen() {
  showPic.value = true;

  // 将图片添加到body中
  if (proxy) {
    document.body.appendChild(proxy.$refs.fullScreenImg as any);

    // 等待DOM更新
    nextTick(() => {
      // 设置全屏样式
      (proxy.$refs.fullScreenImg as any).style.position = 'fixed';
      (proxy.$refs.fullScreenImg as any).style.top = '0';
      (proxy.$refs.fullScreenImg as any).style.left = '0';
      (proxy.$refs.fullScreenImg as any).style.width = '100vw';
      (proxy.$refs.fullScreenImg as any).style.height = '100vh';
      (proxy.$refs.fullScreenImg as any).style.objectFit = 'contain';
      (proxy.$refs.fullScreenImg as any).style.background = 'rgba(0,0,0,0.8)';
    });
  }

}
function hideFullScreen() {
  showPic.value = false;

  // 将图片从body中移除
  if (proxy)
    document.body.removeChild(proxy.$refs.fullScreenImg as any);
}

// 保存原始结构
// <div class="demo-image__preview">
//     <!-- <img :src="require('../assets/images/' + picData.picName)" width='112' height='112'/> -->
//     <el-image v-if="isBase64(picData.image_data)" :src="getBase64(picData.image_data)" fit="fill" style="width: 112px; height: 112px"
//       :preview-src-list="[getBase64(picData.image_data)]" :preview-teleported="true">
//       <!-- fit:图片如何适应容器框,src:图片链接,preview-src-list:大图预览链接，需要数组,preview-teleported:插入至body元素上 -->
//       <!-- 加载失败内容 -->
//       <div slot="placeholder">未加载是显示的内容</div>
//       <div slot="error" class="image-slot">
//         <el-image fit="cover" src="require('@/assets/images/000000.jpg')" />
//       </div>
//     </el-image>
//     <el-image v-else :src="require('@/assets/images/' + picData.image_data)" fit="fill" style="width: 112px; height: 112px"
//       :preview-src-list="[require('@/assets/images/' + picData.image_data)]" :preview-teleported="true">
//       <!-- fit:图片如何适应容器框,src:图片链接,preview-src-list:大图预览链接，需要数组,preview-teleported:插入至body元素上 -->
//       <!-- 加载失败内容 -->
//       <div slot="placeholder">未加载是显示的内容</div>
//       <div slot="error" class="image-slot">
//         <el-image fit="cover" src="require('@/assets/images/000000.jpg')" />
//       </div>
//     </el-image>
//   </div>

</script>
<style scoped>
</style>
<style>
/* 需要穿透的样式 */

/* 禁止拖动变蓝 */
body {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 大图预览的关闭图标 里面内容大一点 */
.el-image-viewer__btn.el-image-viewer__close {
  opacity: unset;
  font-size: 40px;
}

/* 大图预览的导航栏图标 里面内容高一点且大一点 */
.el-image-viewer__actions__inner {
  bottom: 40px;
  font-size: 40px;
}
</style>