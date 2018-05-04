<?php
namespace app\index\controller;

class Index
{
    public function index()
    {
        return '';
    }

    public function submit_form_mail()
    {
    	$post = input('post.');
    	$aid = input('post.aid', 0, 'intval');
    	$goods = config('goods.goods');
    	$mailconf = config('mail');
    	$mail_text = '';
    	if (isset($goods[$aid])) {
    		$goods_name = $goods[$aid];
    	}
    	if (!empty($goods_name) && !empty($post['phone'])) {
    		$ming = $post['ming'];
    		$phone = $post['phone'];
    		$mail_text_body = <<<EOF
{$mail_text}\n
下单商品：{$goods_name}\n
联系人：{$ming}\n
联系电话：{$phone}\n
EOF;
			// var_dump($mail_text_body);

			// Create the Transport
			$transport = (new \Swift_SmtpTransport($mailconf['mailhost'], $mailconf['mailport']))
			  ->setUsername($mailconf['username'])
			  ->setPassword($mailconf['userpass'])
			;

			// Create the Mailer using your created Transport
			$mailer = new \Swift_Mailer($transport);

			// Create a message
			$message = (new \Swift_Message($mailconf['mail_subject']))
			  ->setFrom($mailconf['mailfrom'])
			  ->setTo($mailconf['mailto'])
			  ->setBody($mail_text_body)
			  ;

			// Send the message
			$result = $mailer->send($message);
			if ($result) {
				return json(['code' => 200, 'msg' => '发送成功！']);
			}
    	}
		return json(['code' => 500, 'msg' => '发送失败！！！']);
    }
}
