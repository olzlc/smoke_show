<template>
  <div class="demo-image__preview">
    <!-- <img :src="require('../assets/images/' + picData.picName)" width='112' height='112'/> -->
    <el-image v-if="isBase64(picData.image_data)" :src="getBase64(picData.image_data)" fit="fill"
      style="width: 112px; height: 112px" @click="handleClick">
      <!-- fit:图片如何适应容器框,src:图片链接,preview-src-list:大图预览链接，需要数组,preview-teleported:插入至body元素上 -->
      <!-- 加载失败内容 -->
      <div slot="placeholder">未加载是显示的内容</div>
      <div slot="error" class="image-slot">
        <el-image fit="cover" src="require('@/assets/images/000000.jpg')" />
      </div>
    </el-image>
    <el-image v-else :src="require('@/assets/images/' + picData.image_data)" fit="fill"
      style="width: 112px; height: 112px" @click="handleClick">
      <!-- fit:图片如何适应容器框,src:图片链接,preview-src-list:大图预览链接，需要数组,preview-teleported:插入至body元素上 -->
      <!-- 加载失败内容 -->
      <div slot="placeholder">未加载是显示的内容</div>
      <div slot="error" class="image-slot">
        <el-image fit="cover" src="require('@/assets/images/000000.jpg')" />
      </div>
    </el-image>
    <el-dialog v-model="showPic" title="图片信息" width="75%" append-to-body>
      <div style="min-height:400px">
        <div class="left-box">
          <div class="image-container">
            <el-image v-if="isBase64(picData.image_data)" :src="getBase64(picData.image_data)" fit="fill"
              style="position:absolute;left:15%; top:0; width:70%;height:70%">
              <div slot="placeholder">未加载是显示的内容</div>
              <div slot="error" class="image-slot">
                <el-image fit="cover" src="require('@/assets/images/000000.jpg')" />
              </div>
            </el-image>
            <el-image v-else :src="require('@/assets/images/' + picData.image_data)" fit="fill"
              style="position:absolute; left:15%; top:0; width:70%;height:70%">
              <div slot="placeholder">未加载是显示的内容</div>
              <div slot="error" class="image-slot">
                <el-image fit="cover" src="require('@/assets/images/000000.jpg')" />
              </div>
            </el-image>
          </div>
        </div>
        <div class="right-box">
          <el-descriptions class="margin-top" :column="3" size="small" border>
            <el-descriptions-item :span="1.5">
              <template #label>
                <div class="cell-item">纬度
                </div>
              </template>
              {{ picData.info.lat }}
            </el-descriptions-item>
            <el-descriptions-item :span="1.5">
              <template #label>
                <div class="cell-item">经度
                </div>
              </template>
              {{ picData.info.lng }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  火势强度
                </div>
              </template>
              <el-tag
                :type="picData.info.fireIntensity === 'small' ? '' : picData.info.fireIntensity === 'medium' ? 'warning' : 'danger'"
                size="small" round>{{ picData.info.fireIntensity }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  风向
                </div>
              </template>
              <el-tag size="small" type='success' round>{{ picData.info.windDirection }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item :span="3">
              <template #label>
                <div class="cell-item">
                  火灾类型
                </div>
              </template>
              <el-tag size="small" type='info' round>{{ picData.info.fireType }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  受害人数
                </div>
              </template>
              {{ picData.info.victim }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  消防队伍
                </div>
              </template>
              {{ picData.info.fireBrigade }}支
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  财产损失
                </div>
              </template>
              {{ picData.info.money }}元
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  风速强度
                </div>
              </template>
              {{ picData.info.beaufort }}级
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  每天降雨量
                </div>
              </template>
              {{ picData.info.rainfall }}毫米
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  相对湿度
                </div>
              </template>
              {{ picData.info.humidity }}%
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  温度
                </div>
              </template>
              {{ picData.info.temperature }}°
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  开始时间
                </div>
              </template>
              {{ formatDate(picData.info.start_time) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  结束时间
                </div>
              </template>
              {{ formatDate(picData.info.end_time) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  省
                </div>
              </template>
              {{ picData.info.province }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  市
                </div>
              </template>
              {{ picData.info.city }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  区
                </div>
              </template>
              {{ picData.info.area }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  地址
                </div>
              </template>
              {{ picData.info.address }}
            </el-descriptions-item>
          </el-descriptions>
          <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="showPic = false">Close</el-button>
        </div> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref, computed } from "vue";
import moment from 'moment';

const showPic: Ref<boolean> = ref(false)  // 预览图片是否可见
/**
 * 这一页设计的是地图poi气泡的样式
 */
const picData = defineProps<{
  image_data: string;
  info: any;
}>();


const handleClick = () => {
  showPic.value = true;
  console.log(picData.info)
}

const isBase64 = (str: string) => {
  if (str === '' || str.trim() === '') {
    return false;
  }
  try {
    return btoa(atob(str)) == str;
  } catch (err) {
    return false;
  }
}

const getBase64 = (base64: string) => {
  return ('data:image/png;base64,' + base64).replace(/[\r\n]/g, '')
}

// 转换格式
function formatDate(date: Date) {
    return moment(date).format('YYYY-MM-DD');
}

</script>
<style scoped>
/* 左边盒子 */
.left-box {
  display: block;
  float: left;
  height: 100%;
  width: 47%;
  margin-left: 10px;
  /* border: solid 1px var(--el-border-color); */
}

/* 右边盒子 */
.right-box {
  display: block;
  float: right;
  height: 100%;
  width: 47%;
  margin-right: 10px;
  /* border: solid 1px var(--el-border-color); */
}

 /* 图片容器 */
 .image-container {
    position:relative;
    width:100%;
    padding-bottom:100%; /* 宽高比例为1:1 */
  }
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