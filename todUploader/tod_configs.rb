require 'yaml'
require 'csv'
#YAML::ENGINE.yamler='psych'
YAML::ENGINE.yamler= 'syck' if defined?(YAML::ENGINE)

#This is a script to add TOD configs to the existing config ymls. A lot of hardcoding is currently in place which needs to be fixed
if ARGV.length < 1
  puts "Usage ruby tod_configs.rb <Name of CSV file with tod configs>"
  exit 1
end

tod_hdfs_path = "hdfs://smartdeals-cdh4-hadoop-namenode-lup1.lup1/data/smartdeals/prod/##countryCode##/calcs/%%date%%/##permalink##/*/translated_results/rmsplit/tod_split/##tod##"
tod_string = "##tod##"
country_string = "##countryCode##"
permalink_string = "##permalink##"

updates = CSV.read(ARGV[0])
config_dir='/Users/kaiwang/Project/test/batch_intl/'
for config in Dir.glob(config_dir +  "*.yml")
  print config
  config_file = YAML.load_file(config)
  tod_overrides = config_file['todOverrides']
  updated = false
  updates.each { |update|
    if config_file['countryCode'] == update[0] and (config_file['headers']['campaignGroup'] == update[1] or (config_file['headers']['businessGroup'] == 'goods' or config_file['headers']['businessGroup'] == 'getaways') and config_file['emailName'].include? update[1])
      exists = false
      if update[2] == "MAIN_SEND"
        config_file['cronTime'] = update[3].to_s
        updated = true
        next
      end
      if not tod_overrides.nil?
        tod_overrides.each { |tod_override|
          if tod_override['hdfsPath'].include?(update[2])
	    tod_override['cronTime'] = update[3].to_s
	    exists = true
            updated = true
            break
          end
        }
      end
      if not exists
        tod_override = {}
        tod_override['cronTime'] = update[3].to_s
        country_code = update[0].downcase
        if country_code == 'uk'
          country_code = 'gb'
        end
        tod_path = "hdfs://smartdeals-cdh4-hadoop-namenode-lup1.lup1/data/smartdeals/prod/" + country_code + "/calcs/%%date%%/" + update[1] + "/*/translated_results/rmsplit/tod_split/" + update[2]
        tod_override['hdfsPath'] = tod_path
        if not tod_overrides.nil?
          tod_overrides.push(tod_override)
        else
          tod_overrides = []
          tod_overrides.push(tod_override)
          config_file['todOverrides'] = tod_overrides
        end
        updated = true
      end
    end
  }
  if updated
    File.open(config, 'w') {|f| f.write config_file.to_yaml}
  end
end
