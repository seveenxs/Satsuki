const { AttachmentBuilder } = require('discord.js')
const { getUser } = require('../mongoDB/functions/user');
const { abbreviate } = require('util-stunks')
const Canvas = require('canvas');

Canvas.registerFont('./src/assets/fonts/Tommy-soft.otf', {
    family: 'Tommy',
});

async function createProfile(msin, params, client) {
    
    // Obtendo informações do usuário
    const mentions = msin.mentions.users
    const userCache = client.users.cache;
    const userFinal = userCache.get(params[0]) || userCache.find(user => user.username === params[0]) || mentions.first() || msin.user || msin.author;

    // Obtendo as informações na database
    const UserDB = await getUser(userFinal.id, ["crystals", "profile"]);

    // definindo informações
    const Avatar = userFinal.displayAvatarURL({ extension: 'png', dynamic: true, size: 2048 });

    const AboutMe = UserDB["profile"].aboutme == 'sem sobre-mim'
    ? `Um(a) amigável ${userFinal.username} á vista! Mude este sobre-mim no botão abaixo.`
    : UserDB["profile"].aboutme;

    let aboutmeShortened;
    if (AboutMe.length > 72) {
        const truncatedAboutme = AboutMe.substring(0, 72);
        const extraChars = AboutMe.length - 72;
        aboutmeShortened = `${truncatedAboutme}...(+${extraChars})`;
    } else {
        aboutmeShortened = AboutMe;
    }
    const AboutmeM = aboutmeShortened.match(/.{0,40}/g).join("\n");

    const UserName = userFinal.username.length > 17
    ? userFinal.username.substring(0, 12) + `...(+${userFinal.username.length - 17})`
    : userFinal.username;

    const Reputation = UserDB["profile"].reputation

    const Relationship = UserDB["profile"].relationship.length >= 17
    ? UserDB["profile"].relationship.substring(0, 9) + `...(+${UserDB["profile"].relationship.length - 17})`
    : UserDB["profile"].relationship;

    const Background = UserDB["profile"].background == 'none'
    ? 'https://i.imgur.com/lX1VNsF.png'
    : UserDB["profile"].background;

    const Layout = UserDB["profile"].layout == 'none'
    ? 'https://i.imgur.com/whTj9j1.png'
    : UserDB["profile"].layout;


    // Começando o canvas
    const canvas = Canvas.createCanvas(850, 500);
    const ctx = canvas.getContext('2d');

    // carregando imagens
    const background = await Canvas.loadImage(Background);
    const layout = await Canvas.loadImage(Layout);
    const avatar = await Canvas.loadImage(Avatar);

    // Desenhando o fundo
    ctx.drawImage(background, 0, -100, canvas.width, canvas.height);

    // Desenhando o layout
    ctx.drawImage(layout, 0, 0, canvas.width, canvas.height);

    // Imprimindo os textos
    ctx.textAlign = "left"; 
    ctx.font = '33px Tommy'; 
    ctx.fillStyle = "rgb(253, 255, 252)";
    ctx.fillText(UserName, 270, 204); // NOME DE USUÁRIO

    ctx.textAlign = "left"; 
    ctx.font = '32px Tommy'; 
    ctx.fillStyle = "rgb(253, 255, 252)";
    ctx.fillText(abbreviate(UserDB.crystals), 340, 268); // CRISTAIS DO USUÁRIO

    ctx.textAlign = "left"; 
    ctx.font = '20px Tommy'; 
    ctx.fillStyle = "rgb(253, 255, 252)";
    ctx.fillText(AboutmeM, 36, 430); // SOBRE-MIM DO USUÁRIO

    ctx.textAlign = "left"; 
    ctx.font = '32px Tommy'; 
    ctx.fillStyle = "rgb(253, 255, 252)";
    ctx.fillText(Reputation, 556, 398); // REPUTAÇÕES DO USUÁRIO

    ctx.textAlign = "left"; 
    ctx.font = '28px Tommy'; 
    ctx.fillStyle = "rgb(253, 255, 252)";
    ctx.fillText(Relationship, 556, 466); // RELACIONAMENTO DO USUÁRIO

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