from mailer import Mailer
from mailer import Message

receiver = ''

message = Message(From="squaretablecompany@gmail.com",
                  To=receiver)
message.Subject = "An HTML Email"
message.Html = """<p style="font-size: 30pt; text-align: center; color: green;">Hi!<br>
   It seems like you have forgotten your password!<br>
   Here is the <a href="http://www.python.org">link</a> you wanted.</p>"""

sender = Mailer('smtp.gmail.com', use_tls=True, usr='squaretablecompany@gmail.com', pwd='')
sender.send(message)