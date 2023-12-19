const { getUser } = require('../mongoDB/functions/user');
const { abbreviate } = require('util-stunks')
const Canvas = require('canvas');
const Utils = require('../structures/Util');

Canvas.registerFont('./src/assets/fonts/Tommy-soft.otf', {
    family: 'Tommy',
});

async function createProfile(msin, params, client) {
    
    // Obtendo informações do usuário
    const mentions = msin.mentions?.users
    const userCache = client.users?.cache;
    const userFinal = userCache.get(params[0]) || userCache.find(user => user.username === params[0]) || mentions.first() || msin.user || msin.author;

    // Obtendo as informações na database
    const UserDB = await getUser(userFinal.id, ["crystals", "profile", "premium"]);

    // definindo informações
    const Avatar = userFinal.displayAvatarURL({ extension: 'png', dynamic: true, size: 2048 });

    const AboutMe = UserDB["profile"].aboutme == 'sem sobre-mim'
    ? `Um(a) amigável ${userFinal.username} á vista! Mude este sobre-mim no botão abaixo.`
    : UserDB["profile"].aboutme;

    const Reputation = UserDB["profile"].reputation

    const Background = UserDB["profile"].background == 'none'
    ? 'https://i.imgur.com/lX1VNsF.png'
    : UserDB["profile"].background;

    // Começando o canvas
    const canvas = Canvas.createCanvas(850, 500);
    const ctx = canvas.getContext('2d');

    // carregando imagens
    const background = await Canvas.loadImage(Background);
    const layout = await Canvas.loadImage('./src/assets/layouts/Template-1.png');
    const avatar = await Canvas.loadImage(Avatar);

    // Desenhando o fundo
    ctx.drawImage(background, 0, -100, canvas.width, canvas.height);

    // Desenhando o layout
    ctx.drawImage(layout, 0, 0, canvas.width, canvas.height);


    // Imprimindo os textos
    let badges = [];
    if(userFinal.flags.toArray().includes('HypeSquadOnlineHouse3')) badges.push('House_Balance');
    if(userFinal.flags.toArray().includes('HypeSquadOnlineHouse2')) badges.push('House_Brilliance');
    if(userFinal.flags.toArray().includes('HypeSquadOnlineHouse1')) badges.push('House_Bravery');
    if (UserDB.premium) badges.push('Premium');
    if (client.developers.includes(userFinal.id)) badges.push('Developer');

    badges = badges
    .map((badge) => {
        switch (badge) {
        case 'Premium':
            return '<:SCrystal:1186355003741450252>';
        case 'Developer':
            return '<:Developers:1186357686758023220>';
        case 'House_Balance':
            return '<:Balance:1186590475617046588>';
        case 'House_Brilliance':
            return '<:Brillance:1186590473746395146>';
        case 'House_Bravery':
            return '<:Bravery:1186590471242403940>';
        default:
            return '';
        }
    })
    .join('\n');

    ctx.textAlign = "left"; 
    ctx.font = '22px Tommy'; 
    ctx.fillStyle = "rgb(253, 255, 252)";
    await Utils.RenderEmoji(ctx, badges, 10, 334);

    ctx.textAlign = "left"; 
    ctx.font = '33px Tommy'; 
    ctx.fillStyle = "rgb(253, 255, 252)";
    await Utils.RenderEmoji(ctx, Utils.Shorten(userFinal.username, 16), 270, 204)

    ctx.textAlign = "left"; 
    ctx.font = '32px Tommy'; 
    ctx.fillStyle = "rgb(253, 255, 252)";
    ctx.fillText(abbreviate(UserDB.crystals), 340, 268); // CRISTAIS DO USUÁRIO

    ctx.textAlign = "left"; 
    ctx.font = '20px Tommy'; 
    ctx.fillStyle = "rgb(253, 255, 252)";
    await Utils.RenderEmoji(ctx, Utils.Shorten(AboutMe, 122).match(/.{0,42}/g).join("\n"), 36, 430, 450)
    //ctx.fillText(Utils.Shorten(AboutMe, 122).match(/.{0,42}/g).join("\n"), 36, 430); // SOBRE-MIM DO USUÁRIO

    ctx.textAlign = "left"; 
    ctx.font = '32px Tommy'; 
    ctx.fillStyle = "rgb(253, 255, 252)";
    ctx.fillText(Reputation, 556, 398); // REPUTAÇÕES DO USUÁRIO

    ctx.textAlign = "left"; 
    ctx.font = '28px Tommy'; 
    ctx.fillStyle = "rgb(253, 255, 252)";
    ctx.fillText(Utils.Shorten(UserDB["profile"].relationship, 14), 556, 466); // RELACIONAMENTO DO USUÁRIO

    // Desenhando o avatar do usuário
    ctx.arc(402, 80, 65, 0, Math.PI * 2, true); 
    ctx.strokeStyle = "#303030"; 
    ctx.lineWidth = 6; 
    ctx.stroke(); 
    ctx.closePath(); 
    ctx.clip(); 
    ctx.drawImage(avatar, 332, 0, 160, 160);

    return canvas.toBuffer()
}

module["exports"] = {
    createProfile
}