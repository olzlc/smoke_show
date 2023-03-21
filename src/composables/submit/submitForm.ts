import {ElMessage} from "element-plus";
import {Ref} from "vue";
import axios from "axios";
import {router} from "@/router";
import {openErrorMessage, openSuccessMessage, openWarningMessage,} from "@/composables/utilsFunction";

/**
 * 提交查询表单
 * @param poiDetailsList
 */
export default function postForm(
    formData: FormData,
    isSubmittingQueryForm: Ref<boolean>,
) {
    // ----- 提交表单 -----
    ElMessage.info("已提交查询，请耐心等候。");
    const controller = new AbortController();
    // 骨架屏开关
    isSubmittingQueryForm.value = true; // 显示过渡画面

    // 由于RESTful API是一次性发送请求的，因此似乎难以实现定期从服务器回传数据的功能。
    const waitTimeOut = setTimeout(() => {
        openWarningMessage("预测算法运算时间比预想中要长，请耐心等候。");
    }, 12000);
    const stopQueryTimeOut = setTimeout(() => {
        openErrorMessage(
            "等待结果返回超时，将停止等待。请检查后端服务器是否连通和正常运行。"
        );
        isSubmittingQueryForm.value = false;
        controller.abort() // 停止axios等待
    }, 45000);

    axios
        .post("/addDatabase",
            formData, {
                signal: controller.signal
            }
        ) // 发送请求，等待返回结果
        .then(
            (response) => { // 提取response中的数据
                return response.data;
            }
        )
        .then((data) => {
            // 跳转至结果页
            openSuccessMessage("添加完成，成功返回数据。");
            console.log(data)
            const params = { resultdata: data }
            router.push({
                    // 跳转到结果页
                    name: "Mapbox",
                    // params: {
                    //     resultdata: data,
                    // },
                    state: {params},
                }).then(() =>
                clear(waitTimeOut, stopQueryTimeOut, isSubmittingQueryForm)
            )
                .catch(
                    // 假如跳转错误，提示退出
                    (error) => {
                        clear(waitTimeOut, stopQueryTimeOut, isSubmittingQueryForm,
                            )
                        throw Error(`抱歉，后端系统返回了结果，但是查询结果处理失败，错误代码是${String(error).substr(
                            0,
                            100
                        )}。请重新提交查询再试。`)
                    }
                );
        })
        .catch(
            // 捕获错误，显示错误
            (error:Error) => {
                clear(waitTimeOut, stopQueryTimeOut, isSubmittingQueryForm,
                    error.message)
            }
        );
}



/**
 * 统一清除timeout
 * @param waitTimeOut
 * @param stopQueryTimeOut
 * @param isSubmittingQueryForm
 * @param errorMessage
 */
function clear(waitTimeOut: number, stopQueryTimeOut: number, isSubmittingQueryForm: Ref<boolean>, errorMessage: string = "") {
    clearTimeout(waitTimeOut);
    clearTimeout(stopQueryTimeOut);
    isSubmittingQueryForm.value = false;

    if (errorMessage != "") {
        openErrorMessage(
            errorMessage,
            "long"
        );
    }
}
