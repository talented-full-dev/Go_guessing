package email

import (
	"bytes"
	"log"
	"net/smtp"
)

type Email struct {
	From string
	To   string
	Text string

	SupportEmail string
	Password     string

	SmtpHost string
	SmtpPort string
}

func (self *Email) Init() {
	// Default sender data.
	self.From = "isiproject.arcgis@gmail.com"
	self.SupportEmail = "isiproject.arcgis@gmail.com"
	self.Password = "MyPasswordIsNothing13"

	// smtp server configuration.
	self.SmtpHost = "smtp.gmail.com"
	self.SmtpPort = "587"
}

func (self *Email) Send(token, toEmail string) error {
	self.To = toEmail
	self.Text = token
	// Authentication.
	auth := smtp.PlainAuth("", self.From, self.Password, self.SmtpHost)

	// Sending email.
	err := smtp.SendMail(self.SmtpHost+":"+self.SmtpPort, auth, self.From, []string{self.To}, self.ToBytes())
	if err != nil {
		return err
	}

	log.Println("Email Sent Successfully to ", self.To)
	return nil
}

func (self *Email) ToBytes() []byte {
	buf := bytes.NewBuffer(nil)

	buf.WriteString("Subject: Activation link\r\n")
	buf.WriteString("MIME-Version: 1.0\r\n")

	buf.WriteString("Content-Type: text/plain; charset=utf-8\r\n" + "\r\n")
	buf.WriteString("Your activation link is: \n" + "www.localhost:3000/activation/" + self.Text)
	buf.WriteString("\r\n")

	return buf.Bytes()
}
