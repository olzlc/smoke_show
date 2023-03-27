<template>
    <el-table :data="databaseData" height="640" stripe border style="width: 100%">
        <el-table-column prop="id" label="数据序号" sortable width="90" />
        <el-table-column prop="beaufort" label="风速强度" sortable width="90" />
        <el-table-column prop="fireBrigade" label="消防队伍" sortable width="90" />
        <el-table-column prop="money" label="财产损失" sortable width="90" />
        <el-table-column prop="victim" label="受害人数" sortable width="90" />
        <el-table-column prop="rainfall" label="降雨量" sortable width="90" />
        <el-table-column prop="temperature" label="温度" sortable width="90" />
        <el-table-column prop="humidity" label="相对湿度" sortable width="90" />
        <el-table-column prop="windDirection" label="风向" sortable width="90" />
        <el-table-column prop="fireType" label="火灾类型" sortable width="90" />
        <el-table-column prop="fireIntensity" label="火势强度" sortable width="90" />
        <el-table-column prop="start_time" label="开始时间" sortable width="120">
            <template #default="scope">
                {{ formatDate(scope.row.start_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="end_time" label="结束时间" sortable width="120">
            <template #default="scope">
                {{ formatDate(scope.row.end_time) }}
          </template>
        </el-table-column>
        <el-table-column label="地址信息">
            <el-table-column prop="lat" label="纬度" width="180" />
            <el-table-column prop="lng" label="经度" width="180" />
            <el-table-column prop="province" label="省" width="180" />
            <el-table-column prop="city" label="市" width="180" />
            <el-table-column prop="area" label="区" width="180" />
            <el-table-column prop="address" label="详细位置" width="180" />
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
import mapData from "@/composables/result-page/exampleData";
import { ElMessage } from "element-plus";
import { Ref, ref } from "vue";
import axios from "axios";
import { selectInfo } from "@/composables/baseTypes";
import {
    openErrorMessage,
    openSuccessMessage,
    openWarningMessage,
} from "@/composables/utilsFunction";
import moment from 'moment';

let databaseData: Ref<selectInfo[]> = ref([] as selectInfo[])
// 由于RESTful API是一次性发送请求的，因此似乎难以实现定期从服务器回传数据的功能。
const controller = new AbortController();
ElMessage.info("正在查询数据库，请耐心等候。");
const waitTimeOut = setTimeout(() => {
    openWarningMessage("预测算法运算时间比预想中要长，请耐心等候。");
}, 12000);
const stopQueryTimeOut = setTimeout(() => {
    openErrorMessage(
        "等待结果返回超时，将停止等待。请检查后端服务器是否连通和正常运行。"
    );
    controller.abort(); // 停止axios等待
}, 45000);

axios
    .post("/selectAllData", {
        signal: controller.signal,
    }) // 发送请求，等待返回结果
    .then((response) => {
        // 提取response中的数据
        return response.data;
    })
    .then((data) => {
        if (data.message === "成功找到数据") {
            openSuccessMessage("添加完成，成功返回数据。");
            databaseData.value = data.original_data
        } else {
            openWarningMessage("添加错误，加载初始数据");
            databaseData = mapData;
        }
        showTableData(databaseData)
        clear(waitTimeOut, stopQueryTimeOut)
    })
    .catch(
        // 捕获错误，显示错误
        (error: Error) => {
            showTableData(mapData);
            clear(
                waitTimeOut,
                stopQueryTimeOut,
                error.message
            );
        }
    );

/**
 * 统一清除timeout
 * @param waitTimeOut
 * @param stopQueryTimeOut
 * @param isSubmittingQueryForm
 * @param errorMessage
 */
function clear(
    waitTimeOut: number,
    stopQueryTimeOut: number,
    errorMessage: string = ""
) {
    clearTimeout(waitTimeOut);
    clearTimeout(stopQueryTimeOut);

    if (errorMessage != "") {
        openErrorMessage(errorMessage, "long");
    }
}

// 转换格式
function formatDate(date: Date) {
    return moment(date).format('YYYY-MM-DD');
}
// 展示数据
function showTableData(data: Ref<selectInfo[]>) {
    console.log(data.value)
}
</script>
<style scoped></style>
<style>
/* 横向滚动条 */
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