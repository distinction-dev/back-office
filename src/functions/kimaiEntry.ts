export const kimaiEntryFunctions = {
    kimaiScheduler: {
        handler: "src/handlers/kimaiScheduler.handler",
        timeout: 30,
        memorySize: 256,
        events: [
                {
                    schedule: "cron(0 0 ? * WED,SUN *)", // Runs at 12:00 AM (midnight) every Wednesday and Sunday
                },
            ],
        },
};
