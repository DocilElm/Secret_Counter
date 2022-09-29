/// <reference types="../CTAutocomplete" />
import request from 'request/index';

var apikey = "c2709309-ded7-4244-a9a5-748f1902c20f";

register('command', Show_Secrets).setCommandName('sc');

const get_uuid = (username) => request({url : `https://playerdb.co/api/player/minecraft/${username}`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => JSON.parse(response)).catch(error =>{ print(error);});
const get_secrets = (username, cute_name) => request({url : `https://sky.shiiyu.moe/api/v2/dungeons/${username}/${cute_name}`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => JSON.parse(response)).catch(error =>{ print(error);});
const get_profile = (apikey, user_uuid) => request({url : `https://api.hypixel.net/skyblock/profiles?key=${apikey}&uuid=${user_uuid}`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => JSON.parse(response)).catch(error =>{ print(error);});
const get_rank = (username) => request({url : `https://api.slothpixel.me/api/players/${username}`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => JSON.parse(response)).catch(error =>{ print(error);});

const get_profile_id = (user_uuid, profiles=null, apikey=null) => {
    const getRecent = (profiles) => !profiles.profiles || !profiles.profiles.length ? null : profiles.profiles.find(a => a.selected) ?? profiles[0]
    if (profiles) return getRecent(profiles)
    return get_profile(apikey, user_uuid).then(profiles => getRecent(profiles)).catch(e => print(`${e}`))
}
function Show_Secrets(username) {
    if(!username){username = Player.getName()}
  get_uuid(username).then(rank_data => {
    let name_ = rank_data.data.player.username;
    let user_uuid = rank_data.data.player.raw_id;
    get_profile_id(user_uuid, null, apikey).then(res => {
    let profile_id = res.profile_id;
    let cute_name = res.cute_name;
    get_secrets(username, cute_name).then(secrets_data => {
        var secrets = secrets_data.dungeons.secrets_found;
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
        ChatLib.chat("§2[Secrets Counter] §4Error Getting Player's Profile Data!")
     });
}).catch(function(error) {
    print(error)
    ChatLib.chat("§2[Secrets Counter] §4Error Getting Player's UUID!")
 });
}