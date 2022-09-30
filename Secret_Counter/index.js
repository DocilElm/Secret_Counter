/// <reference types="../CTAutocomplete" />
import request from 'request/index';

register('command', Show_Secrets).setCommandName('sc');

const get_uuid = (username) => request({url : `https://playerdb.co/api/player/minecraft/${username}`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => JSON.parse(response)).catch(error =>{ print(error);});
const get_secrets = (username) => request({url : `https://sky.shiiyu.moe/api/v2/dungeons/${username}`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => JSON.parse(response)).catch(error =>{ print(error);});
const get_rank = (username) => request({url : `https://api.slothpixel.me/api/players/${username}`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => JSON.parse(response)).catch(error =>{ print(error);});

function Show_Secrets(username) {
    if(!username){username = Player.getName()}
  get_uuid(username).then(rank_data => {
    let name_ = rank_data.data.player.username;
    get_secrets(username).then(data => {
        let profile_
		for (profile in data["profiles"]) {
			if (profile_ == undefined || profile_["dungeons"]["secrets_found"] < data["profiles"][profile]["dungeons"]["secrets_found"]) {
				profile_ = data["profiles"][profile]
			}
		}
        let secrets = profile_.dungeons.secrets_found;
        secrets = Math.trunc(secrets);
        secrets = secrets.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        get_rank(username).then(rank_data => {
            var rank = rank_data.rank_formatted;
            name_ = `${rank} ${name_}`
            ChatLib.chat(`§2[Secrets Counter] ${name_} §6Total Secrets: §7${secrets}`)
        }).catch(function(error) {
        print(error)
        ChatLib.chat("§2[Secrets Counter] §4Error Getting Player's Rank!")
     });
    }).catch(function(error) {
        print(error)
        ChatLib.chat("§2[Secrets Counter] §4Error Getting Player's Secrets!")
     });    
}).catch(function(error) {
    print(error)
    ChatLib.chat("§2[Secrets Counter] §4Error Getting Player's UUID!")
 });
}