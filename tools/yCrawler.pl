#!/usr/bin/perl

# Name    :  yCrawler
# Release :  v 1.0
# Author  :  "Osirys", Giovanni Buzzin
# Contact :  osirys [at] autistici [dot] org / me [at] y-osirys [dot] com
# Web     :  y-osirys.com
# Date    :  17/02/2011

# GNU GPL LICENCE:
# This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public
# License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any
# the Free Software Foundation; either version 2 of the License, or later version.
# This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
# warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
# You should have received a copy of the GNU General Public License along with this program; if not, write to the Free
# Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
# MA 02110-1301, USA.

# Description:

# This software is a web crawler, useful if you need to know all user possible input (GET and POST) on a website.

# HTTP Proxy Support
# Log File Support
# GET/POST Crawling

# Code begins here


use IO::Socket;
use LWP::UserAgent;

$site         = $ARGV[0];
$dom_opt      = $ARGV[1];
$dom_opt_val  = $ARGV[2];
$log_opt      = $ARGV[3];
$log_opt_val  = $ARGV[4];
$prox_opt     = $ARGV[5];
$prox_opt_val = $ARGV[6];

$| = 1;
my $first = 1;
my $lch = 0;
my $lengpv,@errors,$file,@inputs,@pages,@tot,@temp;

if ((!$site)||(!$dom_opt)||(!$dom_opt_val)||(!$log_opt)||(!$log_opt_val)||(!$prox_opt)||(!$prox_opt_val)) {
     $alert = "[-] Bad arguments !\n\n".
           "    Usage: $0 site -m all/lim\n".
           "    -m all       -> Crawls on all sub domains\n".
           "    -m lim       -> Crawls only on the selected site and domain\n".
		 "    -l <path>    -> Store data on Log File\n".
		 "    -l n         -> No data storing\n".
		 "    -p <ip:port> -> Proxy ON\n".
		 "    -p n         -> Proxy OFF\n".
		 "\n";
     error($alert);
}
else {
	if ($site =~ /(http:\/\/)*(www\.)*([a-z0-9.-]+)\.([a-z]{2,4})/i) {
		($http,$www,$host,$domain) = ($1,$2,$3,".".$4);
		if (length($http) < 1) {
			$http = "http://";
		}
		if (length($www) < 1) {
			$www = "www.";
		}
		$site =~ s/.+/$http$www$host$domain/;
	}
	else {
		error("[-] Bad Site !\n\n");
	}
	if ($dom_opt_val !~ /all|lim/) {
		error("[-] Bad domain option value !\n\n");
	}
	if ($log_opt_val !~ /n/) {
		if (!open FILE, '>', $log_opt_val) {
			error("[-] Can't open $log_opt_val : $!\n\n");
		}
		else {
			$file_st = 1;
		}
	}
	$prox_stat = 0;
	if ($prox_opt_val !~ /n/) {
		if ($prox_opt_val =~ /([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3}):([0-9]+)/) {
			$proxy = $1.".".$2.".".$3.".".$4.":".$5;
			$prox_stat = 1;
		}
		else {
			error("[-] Bad proxy value !\n\n");
		}
	}
	&banner();
}

&crawl($site,"GET");

&end();

sub crawl() {
	my($link,$method,$params) = @_;
	my $re;
	my @linkz;

	if ($link =~ /\%([A-Fa-f0-9]{2})/) {
		$link =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/eg;
	}
	&yprint("[+] $link");

	if ($method eq 'GET') {
		$re = get_req($link);
	}
	elsif ($method eq 'POST') {
		$re = post_req($link,$params);
	}

	my @lines = split /\n/, $re;
	my $numel = scalar(@lines);
	my $start = -1;

	# Link with redirect
	if ($lch == 1) {
		$re =~ /#URLSTARTS#(.+)$/;
		my $tml = $1;
		$re =~ s/#URLSTARTS#$tml//;
		$link =~ s/.+/$tml/;
		if ($link =~ /\%([A-Fa-f0-9]{2})/) {
			$link =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/eg;
		}
		$lch = 0;
	}
	$moddd = 0;
	
	# page source code crawler. GET and POST

	foreach my $e(@lines) {
		$start++;
		my($all,$action,$furl);
		# Case GET 1: href="
		if ($e =~ /([^.])href="([^<>"]+)"/i) {
			$all = $2;
			$furl = &mod_url($all,$link);
			if (length($furl) < 1) {
				next;
			}
			$moddd = 1;
          }
		# Case GET 2: href='
		if ($e =~ /([^.])href='([^<>']+)'/i) {
			$all = $2;
			$furl = &mod_url($all,$link);
			if (length($furl) < 1) {
				next;
			}
			$moddd = 1;
          }

		# Case POST

		my $sum = 0;
		my($action,$rtype);
		if ($e =~ /<form([^<>]+)>/i) {
			my $tmpf = $1;
			if (($tmpf =~ /action/i)&&($tmpf =~ /method/i)) {
				if ($e =~ /action(\s*)=(\s*)("*|'*)([^'"]+)("*|'*)/i) {
					$action = $4;
					$sum = $sum + 1;
				}
				if ($e =~ /method(\s*)=(\s*)("*|'*)(get|post)("*|'*)/i) {
					$rtype = $4;
					$sum = $sum + 1;
				}
			}
		}

		if ($sum == 2) {
			my($str,$stri,@strii) = ("",undef,undef);
			$furl = &mod_url($action,$link);
			if (length($furl) < 1) {
				next;
			}
			my $sst = $start - 1;
			do {
				$sst++;
				push(@strii,$lines[$sst]);
			} while (($sst <= $numel)&&($lines[$sst] !~ /<\/form>/i));
			$stri =~ s/\n$//;

			my $c = 0;
			foreach my $e(@strii) {
				my($par,$val);
				my $ok = 0;
				if ($e =~ /<input([^<>]+)/i) {
					my $tmpf = $1;
					$val = "";
					if ($tmpf =~ /name/i) {
						if ($e =~ /name(\s*)=(\s*)("*|'*)([^'"\s<>]+)("*|'*)/i) {
							$par = $4;
							$ok = 1;
						}
						if ($e =~ /value(\s*)=(\s*)("*|'*)([^'"\s<>]+)("*|'*)/i) {
							$val = $4;
						}
					}
				}
				if ($e =~ /<textarea([^<>]+)>/i) {
					my $tmpf = $1;
					$val = "";
					if ($tmpf =~ /name/i) {
						if ($e =~ /name(\s*)=(\s*)("*|'*)([^'"\s<>]+)("*|'*)/i) {
							$par = $4;
							$ok = 1;
						}
					}
				}
				if ($e =~ /<select([^<>]+)>/i) {
					my $tmpf = $1;
					$val = "";
					if ($tmpf =~ /name/i) {
						if ($e =~ /name(\s*)=(\s*)("*|'*)([^'"\s<>]+)("*|'*)/i) {
							$par = $4;
							my $v = $c+1;
							if ($strii[$v] =~ /<option([^<>]+)>/i) {
								my $tmpo = $1;
								if ($tmpo =~ /value(\s*)=(\s*)("*|'*)([^'"<>]+)("*|'*)/i) {
									my $tval = $4;
									my $srt = $3;
									if ($srt !~ /'|"/) {
										if ($tval =~ /([^\s]+)/) {
											$val = $1;
										}
									}
									else {
										$val = $tval;
									}
								}
							}
							$ok = 1;
						}
					}
				}

				if ($ok == 1) {

					if ($rtype =~ /post/i) {

						$val =~ s/([\W])/"%" . uc(sprintf("%2.2x",ord($1)))/eg;
						if (length($val) < 1) {
							$str .= "'".$par."' => '', ";
						}
						else {
							$str .= "'".$par."' => ".$val.", ";
						}
					}
					elsif ($rtype =~ /get/i) {
						if (length($val) < 1) {
							$str .= $par."=&";
						}
						else {
							$str .= $par."=".$val."&";
						}
					}
				}
				$c++;
			}
			$str =~ s/, $//;
			$str =~ s/&$//;
			if ($rtype =~ /post/i) {
				if (length($str) > 1) {
					$moddd = 1;
					$furl = $furl."|||".$str;
					#print "\n[#] $furl\n\n";
				}

			}
			elsif ($rtype =~ /get/i) {
				if (length($str) > 1) {
					$moddd = 1;
					$furl = $furl."?".$str;
					#print "\n[-] $furl\n\n";
				}
			}
		}
		if ($moddd == 1) {
			push(@linkz,$furl);
		}
		$moddd = 0;
     }
	
	foreach my $e(@linkz) {
		my $r,$s;
		my $fd = 0;
		if ($e =~ /(.+)\|\|\|(.+)/) {
			$r = $1;
			my $t = $2;
			$s = $r."\n".$t;
		}
		else {
			$r = $e;
			$s = $r;
		}

		if (($fd = in_array($s,@tot)) == 0) {
			if ($s =~ /([\?=]+)/) {
				#print "\n Messo $s in \@ inputs\n\n";
				push(@inputs,$s);
			}
			else {
				#print "\n Messo $s in \@ pages\n\n";
				push(@pages,$s);
			}
			push(@tot, $s);
			if ($method eq 'GET') {
				&crawl($r,"GET","");
			}
		}
	}
}

sub mod_url() {
	my $all = $_[0];
	my $link = $_[1];
	if ($all =~ /^ /) {
		$all =~ s/^ //;
	}
	if ($all =~ / $/) {
		$all =~ s/ $//;
	}

	if ($all =~ /\%([A-Fa-f0-9]{2})/) {
		$all =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/eg;
	}
	$all =~ s/\/\//\//g;
	if ($all =~ /http:\/([^\/])/) {
		$all =~ s/http:\//http:\/\//;
	}
	if ($all =~ /^http:\/\//) {
		if ($all !~ /^http:\/\/www\./) {
			$all =~ s/http:\/\//http:\/\/www\./;
		}
	}
	elsif ($all =~ /^www\./) {
		$all =~ s/^www\./http:\/\/www\./;
	}

	# ABSOLUTE URLS CASE

	if ($all =~ /^(http:\/\/www\.)([a-z0-9.-]+)\.([a-z]{2,4})(.*)/i) {
		my($surl,$rest,$rest2) = ($1,$2.".".$3,$4);
		my $tm = $host.$domain;
		if ($dom_opt_val == 'all') {
			if ($rest !~ /$tm/) {
				return;
			}
		}
		elsif ($dom_opt_val == 'lim') {
			if ($rest != $tm) {
				return;
			}
		}

		if (length($rest2) < 1) {
			$all =~ s/(.+)/$1\//;
		}

		# File extensions check

		if ($all !~ /\/$/) {
			if (($rest2 =~ /([^.]*)\.([^.]*)/)&&($all !~ /(\.php|\.php3|\.php5|\.htm|\.html|\.jsp|\.asp|\.aspx)/)) {
				return;
			}
			if ($rest2 =~ /&#([a-zA-Z0-9-_]+);/) {
				my $anch = $1;
				$all =~ s/&#([a-zA-Z0-9-_]+);//g;
			}
			elsif ($rest2 =~ /#([a-zA-Z0-9-_]+)/) {
				my $anch = $1;
				$all =~ s/#([a-zA-Z0-9-_]+)//g;
			}
		}
	}

	# RELATIVE URLS CASE

	else {
		if ($all =~ /^https|^javascript:/) {
			return;
		}

		# Final part URL check, file extensions check

		if ($all !~ /\/$/) {
			if (($all =~ /(mailto:|^#|^\/$)/)||(($all =~ /([^.]*)\.([^.]*)/)&&($all !~ /(\.php|\.php3|\.php5|\.htm|\.html|\.jsp|\.asp|\.aspx)/))) {
				return;
			}
			if ($all =~ /&#([a-zA-Z0-9-_]+);/) {
				my $anch = $1;
				$all =~ s/&#$anch;//g;
			}
			elsif ($all =~ /#([a-zA-Z0-9-_]+)/) {
				my $anch = $1;
				$all =~ s/#$anch//g;
			}
		}
		if ($link !~ /$domain\//) {
			$link =~ s/$domain/$domain\//;
		}

		# Link that starts with "/"

		if ($all =~ /^\/(.+)/) { 
			my $v = $1;
			my $l = $link;
			$l =~ s/$domain(.+)/$domain\/$v/;
			$all =~ s/(.+)/$l/;
		}

		# Other Links

		else {
			my $cl = 0;
			if (($all =~ /^\.\/(.+)/)||($all =~ /^([.\/]+)(.+)/)) {
				if ($all =~ /^\.\.\//) {
					if ($link !~ /\/$/) {
						$link =~ s/\/([^\/]+)$/\//;
					}
					my $link_ = $link;
					while ($all =~ /\.\.\//g) {
						if ($link_ =~ /(.+)\/([^\/]+)/) {
							my($a,$b) = ($1,$2);
							$link_ =~ s/$a\/$b/$a/;

						}
					}
					$all =~ s/\.\.\///g;
					my $all_ = $all; 
					$all =~ s/.+/$link_$all_/;
                    }
				elsif ($all =~ /^\.\/(.+)/) {
					my $v = $1;
					my $l = $link;
					$l =~ s/$domain(.+)/$domain\/$v/;
					$all =~ s/(.+)/$l/;
				}
				$cl = 1;
			}
               else {
				if ($link =~ /\/$/) {
					$all =~ s/^\.\///;
					if ($all =~ /^\//) {
						$all =~ s/^\///;
					}
					$url_mod = $link;
					my $all_ = $all; 
					$all =~ s/.+/$url_mod$all_/;
				}
				else {
					$all =~ s/^\.\///;
					$ll = &link_subs($link,$all);
					my $all_ = $all;
					$all =~ s/.*/$ll$all_/;
				}
			}
		}
	}
	return($all);
}

sub yprint() {
	my $var = $_[0];
	my $print;
	
	if ($file_st == 1) {
		print FILE $var."\n";
	}
	if ($var =~ /^\[\+\]/) {
		$ok = 1;
	}

	if (($ok == 1)&&($first == 1)) {
		$lengpv = length($var);
		print "\r$var";
		$first = 0;
		$ok = 0;
	}
	else {
		if ($var =~ /\n/) {
			print $var."\n";
		}
		else {
			my $t = length($var);
			my $diff = $lengpv - $t;
			if ($diff < 0) {
				$diff = 0;
				$print = $var;
			}
			else {
				my($str,$str1) = ("","");
				for ($i = 0;$i < $diff;$i++) {
					$str .= " ";
					$str1 .= "\b";
				}
				$print = $var;
				$print =~ s/(.+)/$1$str$str1/;
			}
			print "\r$print";
			$lengpv = length($var);
		}
	}
}

sub in_array() {
	my($l,@arr) = @_;
	my $found = 0;
	while ((@arr)&&($found != 1)) {
		$e = shift @arr;
		if ($found == 0) {
			if ($e eq $l) {
				$found = 1;
			}
			else {
				my($pageA,$pageB,$sum) = ("","",0);
				if ($e =~ /([a-zA-Z0-9_]+)(\.php|\.php3|\.php5|\.htm|\.html|\.jsp|\.asp|\.aspx)/) {
					$pageA = $1.$2;
				}
				if ($l =~ /([a-zA-Z0-9_]+)(\.php|\.php3|\.php5|\.htm|\.html|\.jsp|\.asp|\.aspx)/) {
					$pageB = $1.$2;
				}
				if ((length($pageA)>0)&&(length($pageB) >0)&&($pageA eq $pageB)) {
					$sum = 1;
				}
				else {

				}
				if (($sum == 1)&&(($e =~ /[?=]/)&&($l =~ /[?=]/))) {
					my $a,$b;
					my $stra = "";
					my $strb = "";
					my($ee,$ll) = ($e,$l);
					$ee =~ s/(.+)$pageA/$pageA/;
					$ll =~ s/(.+)$pageB/$pageB/;
					while ($ee =~ /([^a-zA-Z0-9_]+)([^=]+)=/g) {
						$a = $2;
						$stra .= $a."=";
					}
					while ($ll =~ /([^a-zA-Z0-9_]+)([^=]+)=/g) {
						$b = $2;
						$strb .= $b."=";
					}
					if ($stra eq $strb) {
						$found = 1;
					}
				}
			}
		}
	}
	return $found;
}

sub link_subs() {
	my $link_ = $_[0];
	my $all = $_[1];    
	$link_ =~ /$domain(.*)\/([^\/]+)/;
	my $s = $1;
	if ($s !~ /\/$/) {
		$s =~ s/(.*)/$1\//;
	}
	$url_mod = "http://www.".$host.$domain.$s;
	if (($url_mod =~ /\/$/)&&($all =~ /^\//)) {
		$url_mod =~ s/\/$//;
	}
	return $url_mod;
}

sub get_req() {
	my $link = $_[0];
	my($content,$str);
	my $ua = LWP::UserAgent->new();
	$ua->timeout(4);
	$ua->agent('Mozilla/5.0');
	if ($prox_stat == 1) {
		$ua->proxy('http', $proxy);
	}
	my $response = $ua->get($link);
	my $url = $response->base;
	if ($response->is_success) {
		$content = $response->content;
		if ($url ne $link) {
			$lch = 1;
			$str = $content."#URLSTARTS#".$url;
		}
		else {
			$str = $content;
		}
	}
	else {
		my $err = $response->status_line;
		my $errs = $link." -> ".$err;
		push(@errors,$errs);
	}
	return($str);
}

sub post_req() {
	my($link,$str) = @_;
	my $ua = LWP::UserAgent->new();
	$ua->timeout(4);
	$ua->agent('Mozilla/5.0');
	if ($prox_stat == 1) {
		$ua->proxy('http', $proxy);
	}
	my $response = $ua->post( $link,
							[ $str ]
						);
	if ($response->is_success) {
		$content = $response->content;
	}
	return($content);
}

sub error() {
	my $alert = $_[0];
	&banner();
	&yprint($alert);
	exit(0);
}

sub end() {
	print "\n\n\ninputs: ".scalar(@inputs)."\n\npages : ".scalar(@pages)."\n\n";
	my $tot_inputs = scalar(@inputs);
	my $tot_pages = scalar(@pages);
	my $tot_errors = scalar(@errors);


	&yprint("\n\n[+] Totals found : ".scalar(@tot)."\n");
	&yprint("\n[+] Total inputs (GET/POST requests) found : $tot_inputs\n");
	if ($tot_inputs > 0) {
		my @i = sort(@inputs);
		foreach my $e(@i) {
			&yprint("    $e\n");
		}
	}
	&yprint("\n\n[+] Total pages found : $tot_pages\n");
	if ($tot_pages > 0) {
		my @i = sort(@pages);
		foreach my $e(@i) {
			&yprint("    $e\n");
		}
	}
	&yprint("\n\n[+] Errors while crawling : $tot_errors\n");
	if ($tot_errors > 0) {
		my @i = sort(@errors);
		foreach my $e(@i) {
			&yprint("    $e\n");
		}
	}
	&yprint("\n\nEnd\n\n");
	if ($file_st == 1) {
		close(FILE);
	}
	exit(0);
}

sub banner() {
	my $d = "\n".
		   "------------------------------------\n".
		   "           yCrawler v 1.0\n".
		   "     by Giovanni Buzzin - Osirys\n".
		   "       visit: www.y-osirys.com\n".
		   "------------------------------------\n".
		   "       Web Crawler\n".
		   "         [+] GET/POST requests\n".
		   "         [+] Log File support\n".
		   "         [+] Proxy Support\n".
		   "------------------------------------\n\n";
	&yprint("$d");
}


# End of code
# Osirys - yYy