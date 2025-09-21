const child_process = require("child_process");
const fs = require("fs");
const SteamUser = require("steam-user");

const user = new SteamUser({
	enablePicsCache: true,
	picsCacheAll: true,
	changelistUpdateInterval: 60_000,
});
user.logOn({ anonymous: true });
user.on("loggedOn", () => {
	console.log(`Logged on to Steam as ${user.steamID.steam3()}`);
});
user.on("appUpdate", (appId, data) => {
	console.log(`Change ${data.changenumber}`);
	fs.writeFileSync("appinfo/" + appId + ".json", JSON.stringify(data.appinfo, null, 2));
	child_process.execSync(`git add appinfo/${appId}.json`);
	try {
		child_process.execSync(`git commit -m "Change ${data.changenumber} (missingToken=${data.missingToken})"`)
	}
	catch (e) {
		console.log(e);
	}
});
