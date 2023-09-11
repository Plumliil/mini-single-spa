import overwriteEventsAndHistory from './navigation/overwriteEventsAndHistory'
export { default as registerApplication } from './application/registerApplication'
export { default as start } from './start'

// 声明window对象为any,防止类型报错
declare const window: any

// 是否运行在 single spa 下
window.__IS_SINGLE_SPA__ = true

overwriteEventsAndHistory()