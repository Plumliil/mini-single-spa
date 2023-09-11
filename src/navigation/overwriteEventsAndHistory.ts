import { loadApps } from '../application/apps'

const originalPushState = window.history.pushState
const originalReplaceState = window.history.replaceState
/**
 * 重写路由相关的事件和历史记录
 */
export default function overwriteEventsAndHistory() {
    // 对pushState添加额外的行为
    window.history.pushState = function (state: any, title: string, url: string) {
        const result = originalPushState.call(this, state, title, url)
        // loadApps()
        console.log('originalPushState')
        return result
    }
    // 对replaceState添加额外的行为
    window.history.replaceState = function (
        state: any,
        title: string,
        url: string,
    ) {
        const result = originalReplaceState.call(this, state, title, url)
        // 根据当前url加载或卸载app
        // loadApps()
        console.log('originalReplaceState')

        return result
    }
    // 事件在浏览器的历史记录发生变化（如点击浏览器的前进或后退按钮）时触发。
    window.addEventListener(
        'popstate',
        () => {
            loadApps()
            // console.log('我前进或后退')
        },
        true,
    )
    // 事件在浏览器的 URL 的哈希部分发生变化时触发。
    window.addEventListener(
        'hashchange',
        () => {
            loadApps()
            // console.log('我切换路由')
        },
        true,
    )
}
