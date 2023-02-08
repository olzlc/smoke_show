
import {ElMessage} from "element-plus/es";
/** 实现ElButton点击之后自动失去焦点的功能。
 *
 * @param event 由ElButton触发的事件
 */
// @ts-ignore
export function removeElButtonFocus(event){
    let target = event.target;
    if(target && target.nodeName === "SPAN"){
        target = target.parentNode;
    }
    target.blur();
}

function replaceDurationOptionsToTimeLength(duration: 'long' | 'short' | number) {
    if (duration === 'long') {
        return 2000;
    } else if (duration === 'short') {
        return 1000;
    } else {
        return duration
    }
}

function openMessageWrapper(message: string, duration: number | 'long' | 'short' = "long", type: 'success' | 'warning' | 'info' | 'error') {
    ElMessage({
        dangerouslyUseHTMLString: true,
        message: message,
        type: type,
        duration: replaceDurationOptionsToTimeLength(duration)
    })
}

/**
 * 发送一个 info 提示框。
 * @param message
 * @param duration
 */
export function openInfoMessage(message: string, duration: number | 'long' | 'short' = "long") {
    openMessageWrapper(message, duration, 'info')
}

/**
 * 发送一个 error 提示框。
 * @param message
 * @param duration
 */
export function openErrorMessage(message: string, duration: number | 'long' | 'short' = "long") {
    openMessageWrapper(message, duration, 'error')
}

/**
 * 发送一个 success 提示框。
 * @param message
 * @param duration
 */
export function openSuccessMessage(message: string, duration: number | 'long' | 'short' = "long") {
    openMessageWrapper(message, duration, 'success')
}

/**
 * 发送一个warning提示框。
 * @param message
 * @param duration
 */
export function openWarningMessage(message: string, duration: number | 'long' | 'short' = "long") {
    openMessageWrapper(message, duration, 'warning')
}