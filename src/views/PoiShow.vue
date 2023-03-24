<template><div class="left-box">
  <el-form :model="picForm" label-width="150px" label-position="left">
                    <el-row class="form-row">
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>
                                    <el-space :size="'small'">
                                        <div>风速强度(级)</div>
                                        <el-popover :width="265"
                                            popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 10px;">
                                            <template #reference>
                                                <el-avatar :icon="Info" />
                                            </template>
                                            <template #default>
                                                <p>使用Beaufort风力等级标准对风速进行量化描述，该标准是基于对人类、动物和自然环境的观察，它把风速分成12级</p>
                                                <p>具体标准为:</p>
                                                <p>0 - 无风; 1 - 软微风; 2 - 轻微风;3 - 轻风; 4 - 清风; 5 - 和风; 6 - 轻劲风; 7 - 劲风; 8 -
                                                    猛烈风; 9
                                                    - 狂风; 10 - 暴风; 11 - 大暴风; 12 - 飓风</p>
                                            </template>
                                        </el-popover>
                                    </el-space>
                                </template>
                                <el-input-number v-model="picForm.beaufort" :min="0" :max='12' style="width:160px" />
                                <!-- <div style="margin-left: 10px;">级</div> -->
                            </el-form-item>
                        </el-col>
                    </el-row></el-form>
                  </div>
</template>

<script lang="ts" setup>
import { Info } from "@icon-park/vue-next";
let picForm = {beaufort: 0};
</script>

<style scoped>
.left-box {
    display: block;
    float: left;
    height: 100%;
    width: 47%;
    margin-left: 100px;

}
/* 提示图标信息 */
.el-avatar--default {
    --el-avatar-size: 20px;
}

/* 提示图标信息 */
.el-avatar {
    --el-avatar-text-color: #000;
    --el-avatar-bg-color: #fff;
}
</style>