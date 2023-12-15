const personModel = require("../models/personModel");

const getInfo = async (existingUser, ctx) => {
  if (!existingUser) {
    existingUser = new personModel({ id: ctx.from.id });
    await existingUser.save();
  }

  const username = ctx.message.from.username || null;
  const userLink = username
    ? `@${username}`
    : `[${ctx.from.first_name}](tg://user?id=${ctx.from.id})`;

  existingUser.username = username;
  existingUser.userLink = userLink; // existingUser ga usernameni saqlash
  await existingUser.save(); // existingUser ni saqlash

  // Hozirgi sanani olish
  const currentDate = new Date();
  const currentDateString = currentDate
    .toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
    .replace(/\//g, ".");

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
          "<b>2. Манзилни киритинг! \n\nМисол учун:</b> Чуст шаҳри, Садача МФЙ, Каттабоғ кўчаси, 1-уй"
        );

      case 2:
        existingUser.step = 3;
        existingUser.manzil = text;
        await existingUser.save();
        return ctx.replyWithHTML(
          `<b>3. Майитнинг исми фамилияси ва касбини киритинг! \n\nМисол учун: \n</b><b>Эркак киши бўлса:</b> Салимов Каримхон (1970-йил, Хайдовчи бўлганлар) акани жанозалари бор \n\n<b>Aёл киши бўлса:</b> Салимов Каримхон акани аёллари Салимова Мухлиса  (1968-йил) аяни жанозалари бор`
        );

      case 3:
        existingUser.step = 4;
        existingUser.mayitningMalumoti = text;
        await existingUser.save();
        return ctx.replyWithHTML(
          `<b>4. Фарзандларининг исмини киритинг! \n\nМисол учун:</b> Фарзандлари: Қаюмов Авазбек (1983)`
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
          `<b>6. Қайси қабристонга қўйилишини киритинг! \n\nМисол учун:</b>Садача қабристони`
        );

      case 6:
        existingUser.step = 7;
        existingUser.qabristonNomi = text;
        await existingUser.save();
        return ctx.replyWithHTML(
          `<b>7. Осон топишлик учун уйларини мўлжалини киритинг! \n\nМисол учун:</b> Каттабоғ масжидидан ўтганда 2чи чап кўчага кирганда`
        );

      case 7:
        existingUser.step = 8;
        existingUser.moljal = text;
        await existingUser.save();
        await ctx.telegram.sendMessage(
          process.env.SENDER_TO_CHANEL,
          `<b>ЖАНОЗА ЭЪЛОНИ #№\n${existingUser.joriySana}\n</b>
\n<b>${existingUser.manzil}</b>\n
\n<b>${existingUser.mayitningMalumoti}</b>\n
\n${existingUser.farzandlariningIsmi}\n
<b>\n${existingUser.janazaVaqti}\n</b>
Дафн:\n${existingUser.qabristonNomi}\n
Мўлжал (уйлари):\n<b>${existingUser.moljal}</b>\n
•┈┈┈┈•❈••✾••❈•┈┈┈┈•
Инна лиллаҳи ва инна илайҳи рожиун\n\n<b>Яқинларингизга ҳам улашинг!</b>\nОбуна бўлинг 👉 @janozachust
\n<i>User: @${username}</i>
`,
          { parse_mode: "HTML" }
        );
        ctx.replyWithHTML(
          "<b>✅ Раҳмат! Маълумотингиз тез орада @janozachust каналига жойлаштирилади. \n\nИложи бўлса @janoza_info_bot админига 📍локатция юборинг. Эълон бўйича ўзгаришлар бўлса ҳам админга ёзинг.</b> \n\n<i>Aллоҳ ўтканларни рахматига олсин, яқинларига сабр-у жамил ато қилсин!</i>"
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
