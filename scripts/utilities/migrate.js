const { spawn } = require("child_process");
const child = spawn("npx.cmd", ["prisma", "migrate", "dev", "--name", "remove_review_moderation"], {
  stdio: ["pipe", "inherit", "inherit"],
});
child.stdin.write("y\n");
child.on("close", (code) => {
  process.exit(code);
});
