---
title: 如何绑定两个github帐号
date: 2018-09-26 15:55:50
tag: git/github/gitlab
---
![](/images/coffee.jpg)

一般情况下，一台电脑上有自己的一个github账号，有时你可能会要跟公司和个人的账号分开来进行使用。此时，需要在一台电脑上操作2个github账号进行项目管理。你不能有多个账号添加了同一个公钥，否则你可能会遇到这样类似错误“ERROR: Permission to XXX.git denied to user”。要解决github账号分别对应公钥，需要在创建一个。（假设你已经在用一个自己的github账号绑定了自己的ssh公钥）

## 操作
- 进入到.ssh目录下查看已有的秘钥
 
```
 $ cd ~/.ssh 
 $ ls

```
如果已经存在id_rsa ,id_rsa.pub等，你需要为你新的github账号创建新的ssh公钥。

- 生成新的key,需要注意的his，之前你创建可能还是一路回车，此刻需要你输入新的名字，比如id_rsa_second,让后回车。否则会自动覆盖你之前的sshkey.创建完后需要把你新的sshkey 拷贝到新的github账号下。

```
 $ssh-keygen -t rsa -C "your_email@example.com"
 Generating public/private rsa key pair.
 Enter file in which to save the key (/Users/zhulianggang/.ssh/id_rsa):
 
```

- 配置config,没有的话需要创建个,在.ssh路径下

```
  #default github
  Host github.com
  HostName github.com
  IdentityFile ~/.ssh/id_rsa

  #新的账号，注意github_second
  Host github_second
  HostName github.com
  IdentityFile ~/.ssh/id_rsa_second
```
- 取消全局用名配置，如果之前你有设置全局github用名,为你使用的工程里重新设置对应的用名名

```
取消global
git config --global --unset user.name
git config --global --unset user.email
每一个工程设置用户名
git config  user.email "xxxx@xx.com"
git config  user.name “xxxx”
```
- 新的github账号使用别名pull/push

```
 git clone git@github_second:username/reponame

```
## 检测

```
$ssh -T git@github.com
Hi xxxx! You've successfully authenticated, but GitHub does not provide shell access.

ssh -T git@github_second.github.com
Hi xxx! You've successfully authenticated, but GitHub does not provide shell access.

说明已经可以成功使用，注意新账号使用别名（github_second）即可。
```
