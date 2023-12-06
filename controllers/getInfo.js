const personModel = require("../models/personModel");

const getInfo = async (existingUser, ctx) => {
  if (!existingUser) {
    existingUser = new personModel({ id: ctx.from.id });
    await existingUser.save();
  }

  let text = ctx.message?.text;

  switch (existingUser.step) {
    case 0:
      existingUser.step = 1;
      await existingUser.save();
      return ctx.replyWithHTML(
        "<strong>1. Жаназа вақтини киритинг! \n\n<b>Мисол учун:</b> 21.04.2023 Жума</strong>"
      );

    case 1:
      existingUser.step = 2;
      existingUser.janazaVaqti = text;
      await existingUser.save();
      return ctx.replyWithHTML(
        "<strong>2. Манзилни киритинг! \n\n<b>Мисол учун:</b> Олмазор МФЙ, Яшнобод кўча 1-уй</strong>"
      );

    case 2:
      existingUser.step = 3;
      existingUser.manzil = text;
      await existingUser.save();
      return ctx.replyWithHTML(
        `<strong>3. Майитнинг исми фамилияси ва касбини киритинг! \n\n<b>Мисол учун:</b> Еркак киши бўлса: Қаюмов Ахаджон (1970-йил, тадбиркор) акани жанозалари бор
                \n\nAёл киши бўлса: Қаюмов Ахаджон акани аёллари Қаюмова Малохатжон (1970-йил, тадбиркор) аяни жанозалари бор</strong>`
      );

    case 3:
      existingUser.step = 4;
      existingUser.mayitningMalumoti = text;
      await existingUser.save();
      return ctx.replyWithHTML(
        `<b>4. Фарзандларининг исмини киритинг!</b> \n\n<b>Мисол учун:</b> Фарзандлари: Қаюмов Авазбек, Aзизова Салима`
      );

    case 4:
      existingUser.step = 5;
      existingUser.farzandlariningIsmi = text;
      await existingUser.save();
      return ctx.replyWithHTML(
        `<b>5. Жаноза ўқилиш вақти ва жойини киритинг!</b> \n\n<b>Мисол учун:</b> Жаноза «Каттабоғ» (Садача масжиди) жоме масжидида Жума (13:00) намозидан кейин ўқилади
                        `
      );

    case 5:
      existingUser.step = 6;
      existingUser.janazaVaqti = text;
      await existingUser.save();
      return ctx.replyWithHTML(
        `<b>6. Қайси қабристонга қўйилишини киритинг!</b> \n\n<b>Мисол учун:</b> Дафн: Садача қабристонида`
      );

    case 6:
      existingUser.step = 7;
      existingUser.qabristonNomi = text;
      await existingUser.save();
      return ctx.replyWithHTML(
        `<strong>7. Осон топишлик учун мўлжални киритинг!</strong> \n\n<b>Мисол учун:</b> Барён завод рўпарасида`
      );

    case 7:
      existingUser.moljal = text;
      existingUser.step = 8;
      await existingUser.save();
      await ctx.telegram.sendMessage(
        process.env.SENDER_TO_CHANEL,
        `1. Жаназа вақти: <strong>${existingUser.janazaVaqti}</strong>
2. Манзил: <strong>${existingUser.manzil}</strong>
3. Марҳум ҳақида: <strong>${existingUser.mayitningMalumoti}</strong>
4. Фарзандларининг исми: <strong>${existingUser.farzandlariningIsmi}</strong>
5. Жаназа вақти: <strong>${existingUser.janazaVaqti}</strong>
6. Қабристон номи: <strong>${existingUser.qabristonNomi}</strong>
7. Мўлжал: <strong>${existingUser.moljal}</strong>
    `,
        {
          parse_mode: "HTML",
        }
      );

      await personModel.findOneAndDelete({ id: existingUser.id });
      break;

    // default:
    // return ctx.reply("❗️ Хатолик дефаулт");
  }
};

module.exports = { getInfo };
