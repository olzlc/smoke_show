<template>
  <!-- <img src="../assets/images/1-1-1-001576.jpg" alt="" /> -->
  <img :src="require('../assets/images/'+picName)" alt="" />
</template>

<script lang="ts" setup>
let picName = "001576.jpg";
const pic1 = require('../assets/images/' + picName);
console.log(pic1);
// const getImage = (name: string): string => {
//     // 其实就是将图片导为模块
//     // 获取图片模块
//     const picModules = import.meta.globEager('./image/*')；
//     // 获取指定的图片
//     const path = (`./images/${name}.png`);
//     return picModules[path].default
// }
</script>

<style scoped>

</style>