const personModel = require("../models/personModel");

const getInfo = async (existingUser, ctx) => {
  if (!existingUser) {
    existingUser = new personModel({ id: ctx.from.id });
    await existingUser.save();
  }

  let text =
    ctx.message && ctx.message.text ? ctx.message.text : "⚠️ Ma'lumot yo'q";
  try {
    switch (existingUser.step) {
      case 0:
        existingUser.step = 1;
        await existingUser.save();
        return ctx.replyWithHTML(
          "<b>1. Жорий санани киритинг! \n\nМисол учун:</b> 21.04.2023 Жума"
        );

      case 1:
        existingUser.step = 2;
        existingUser.joriySana = text;
        await existingUser.save();
        return ctx.replyWithHTML(
          "<b>2. Манзилни киритинг! \n\nМисол учун:</b> Олмазор МФЙ, Яшнобод кўча 1-уй"
        );

      case 2:
        existingUser.step = 3;
        existingUser.manzil = text;
        await existingUser.save();
        return ctx.replyWithHTML(
          `<b>3. Майитнинг исми фамилияси ва касбини киритинг! \n\nМисол учун:</b> Еркак киши бўлса: Қаюмов Ахаджон (1970-йил, тадбиркор) акани жанозалари бор
                \n\nAёл киши бўлса: Қаюмов Ахаджон акани аёллари Қаюмова Малохатжон (1970-йил, тадбиркор) аяни жанозалари бор`
        );

      case 3:
        existingUser.step = 4;
        existingUser.mayitningMalumoti = text;
        await existingUser.save();
        return ctx.replyWithHTML(
          `<b>4. Фарзандларининг исмини киритинг! \n\nМисол учун:</b> Фарзандлари: Қаюмов Авазбек, Aзизова Салима`
        );

      case 4:
        existingUser.step = 5;
        existingUser.farzandlariningIsmi = text;
        await existingUser.save();
        return ctx.replyWithHTML(
          `<b>5. Жаноза ўқилиш вақти ва жойини киритинг! \n\nМисол учун:</b> Жаноза «Каттабоғ» (Садача масжиди) жоме масжидида Жума (13:00) намозидан кейин ўқилади`
        );

      case 5:
        existingUser.step = 6;
        existingUser.janazaVaqti = text;
        await existingUser.save();
        return ctx.replyWithHTML(
          `<b>6. Қайси қабристонга қўйилишини киритинг! \n\nМисол учун:</b> Дафн Садача қабристонида`
        );

      case 6:
        existingUser.step = 7;
        existingUser.qabristonNomi = text;
        await existingUser.save();
        return ctx.replyWithHTML(
          `<b>7. Осон топишлик учун мўлжални киритинг! \n\nМисол учун:</b> Барён завод рўпарасида`
        );

      case 7:
        existingUser.step = 8;
        existingUser.moljal = text;
        await existingUser.save();
        await ctx.telegram.sendMessage(
          process.env.SENDER_TO_CHANEL,
          `ЖАНОЗА ЭЪЛОНИ #${existingUser.joriySana}\n
<b>Манзил:</b><i>\n${existingUser.manzil}\n</i>
<b>Марҳум ҳақида:</b><i>\n${existingUser.mayitningMalumoti}\n</i>
<b>Фарзандларининг исми:</b><i>\n${existingUser.farzandlariningIsmi}\n</i>
<b>Жаназа вақти:</b><i>\n${existingUser.janazaVaqti}\n</i>
<b>Қабристон номи:</b><i>\n${existingUser.qabristonNomi}\n</i>
<b>Мўлжал:</b><i>\n${existingUser.moljal}\n</i>
•┈┈┈┈•❈••✾••❈•┈┈┈┈•\n
Иннаа лиллаахи ва иннаа илайҳи рожиъун\n
@janozachust`,
          { parse_mode: "HTML" }
        );
        ctx.replyWithHTML(
          "<b>Маълумот тез орада @janozachust каналига жойлаштирилади.</b> \n\n<i>Aллоҳ ўтканларни рахматига олсин, яқинларига сабр-у жамил ато қилсин!</i>"
        );
        await personModel.findOneAndDelete({ id: existingUser.id });
        break;

      default:
        return ctx.reply("❗️ Хатолик дефаулт");
    }
  } catch (error) {
    console.log("❗️ Switch", error);
  }
};

module.exports = { getInfo };
