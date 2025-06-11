import PQueue from 'p-queue';

export type TaskDoneCallback = (taskId: string) => void;

export default class QueueManageService {
    private queues = new Map<string, PQueue>();
    // 在 QueueManageService 里
    private listeners = new Set<string>();

    private getQueue(taskId: string): PQueue {
        if (!this.queues.has(taskId)) {
            this.queues.set(taskId, new PQueue({ concurrency: 5 }));
        }
        return this.queues.get(taskId)!;
    }

    public addTask(taskId: string, task: () => Promise<void>): (callback: TaskDoneCallback) => void {
        const queue = this.getQueue(taskId);
        queue.add(task);

        // 如果队列为空，则注册 onIdle 监听器
        return this.onTaskDone(taskId);
    }

    // 监听任务完成事件
    public onTaskDone(taskId: string): (callback: TaskDoneCallback) => void {
        // 如果已经有监听器了，就不再添加
        if (this.listeners.has(taskId)) {
            return () => {};
        } else {
            this.listeners.add(taskId);
            return (callback: TaskDoneCallback) => {
                const queue = this.getQueue(taskId);
                queue.onIdle().then(() => {;
                    callback && callback(taskId);
                    // 任务完成后移除监听器
                    this.listeners.delete(taskId);
                    queue.clear(); // 清空队列
                    this.queues.delete(taskId); // 从 Map 中删除队列
                });
            };
        }
        // this.listeners.add(taskId);
        // return (callback) => {
        //     const queue = this.getQueue(taskId);
        //     queue.onIdle().then(() => {;
        //         callback && callback(taskId);
        //         // 任务完成后移除监听器
        //         this.listeners.delete(taskId);
        //         queue.clear(); // 清空队列
        //         this.queues.delete(taskId); // 从 Map 中删除队列
        //     });
        // };
    }
}
