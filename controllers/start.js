const { bot } = require("../core/bot");
const { isReady } = require("../lib/keyboards");
const { message } = require("../lib/messages");
const personModel = require("../models/personModel");
const { getInfo } = require("./getInfo");

bot.start(async (ctx) => {
  if (ctx.message.text === "/start") {
    await personModel.findOneAndDelete({ id: ctx.from.id });
  }

  await ctx.replyWithHTML(message(ctx), {
    reply_markup: {
      inline_keyboard: isReady,
    },
  });
});

bot.on("callback_query", async (ctx) => {
  try {
    ctx.answerCbQuery(); // Tugmachani bosganda izoh berish va hatolarni oldini oladi
    ctx.deleteMessage(); // Oldingi xabarni o'chiradi

    const current_user = await personModel
      .findOne({ id: ctx.from.id })
      .maxTimeMS(30000); // Set timeout to 30 seconds;

    console.log("Hozirgi Foydalanuvchi:", current_user);

    await getInfo(current_user, ctx);
  } catch (error) {
    console.error("❗️ callback_query", error);
  }
});

bot.on("text", async (ctx) => {
  const user_id = ctx.from.id;

  const current_user = await personModel.findOne({ id: user_id });
  await getInfo(current_user, ctx);
});

bot.launch();
