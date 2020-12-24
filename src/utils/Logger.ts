import chalk from "chalk";

class Logger {
    static log(txt: string) {
        console.log(`[${chalk.cyan("INFO")}] ${chalk.gray(this.time)} ${txt}`);
    }

    static warn(txt: string) {
        console.log(`[${chalk.yellowBright("WARN")}] ${chalk.gray(this.time)} ${txt}`);
    }

    static error(txt: string) {
        console.log(`[${chalk.redBright("ERR!")}] ${chalk.grey(this.time)} ${txt}`);
    }

    static custom(prefix: string, txt: string) {
        console.log(`[${prefix}] ${chalk.grey(this.time)} ${txt}`);
    }

    static get chalk() {
        return chalk;
    }

    static get time() {
        return new Date().toLocaleTimeString(undefined, {
            hour12: false
        });
    }
}

export default Logger;