import { isPromise } from 'src/utils/utils'
import { Application, AppStatus } from '../types'

export default function unMountApp(app: Application): Promise<any> {
    // 将应用程序状态改为卸载前
    app.status = AppStatus.BEFORE_UNMOUNT

    // 执行函数的卸载操作
    let result = (app as any).unmount(app.props)
    if (!isPromise(result)) {
        result = Promise.resolve(result)
    }

    // 将应用程序状态改为已卸载
    return result
    .then(() => {
        app.status = AppStatus.UNMOUNTED
    })
    .catch((err: Error) => {
        app.status = AppStatus.UNMOUNT_ERROR
        throw err
    })
}
