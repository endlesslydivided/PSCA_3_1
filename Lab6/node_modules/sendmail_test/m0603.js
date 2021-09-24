const sendmail = require('sendmail')({silent:true});

async function Send(message)
{
  sendmail(
    {
      from:'sashakovalev2002@hotmail.com',
      to:'Kovalev_A@it.belstu.by',
      subject:'Test',
      text: message
    },
    function(err,reply)
    {
      console.log(err && err.stack);
      console.dir(reply);
    }
  )
}

module.exports.send = Send;
