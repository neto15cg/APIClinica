import * as moment from "moment";
import * as fs from "fs";
const DATABASE_RULES = "database/rules.json";

export interface Interval {
  start: string;
  end: string;
}

export interface Rule {
  id?: string;
  especific_day?: string;
  weekly?: "segunda-feira" | "terca-feira" | "quarta-feira" | "quinta-feira" | "sexta-feira" | "sabado" | "domingo" | "1" | "2" | "3" | "4" | "5" | "6" | "0";
  daily?: boolean | null;
  intervals: Interval[];
}

export function createRule(rule: Rule) {
  return new Promise((resolve, reject) => {
    listRules()
      .then(function(rules: Rule[]) {
        let readRules = [];
        rules.forEach(rule => {
          if (rule.especific_day) {
            rule.especific_day = moment(rule.especific_day, "DD-MM-YYYY").format("YYYY-MM-DD");
          }
          if (rule.weekly) {
            if (rule.weekly === "segunda-feira") {
              rule.weekly = "1";
            } else if (rule.weekly === "terca-feira") {
              rule.weekly = "2";
            } else if (rule.weekly === "quarta-feira") {
              rule.weekly = "3";
            } else if (rule.weekly === "quinta-feira") {
              rule.weekly = "4";
            } else if (rule.weekly === "sexta-feira") {
              rule.weekly = "5";
            } else if (rule.weekly === "sabado") {
              rule.weekly = "6";
            } else if (rule.weekly === "domingo") {
              rule.weekly = "0";
            }
          }
          readRules.push(rule);
        });
        if (rule.especific_day) {
          rule.especific_day = moment(rule.especific_day, "DD-MM-YYYY").format("YYYY-MM-DD");
        }

        if (rule.weekly) {
          if (rule.weekly === "segunda-feira") {
            rule.weekly = "1";
          } else if (rule.weekly === "terca-feira") {
            rule.weekly = "2";
          } else if (rule.weekly === "quarta-feira") {
            rule.weekly = "3";
          } else if (rule.weekly === "quinta-feira") {
            rule.weekly = "4";
          } else if (rule.weekly === "sexta-feira") {
            rule.weekly = "5";
          } else if (rule.weekly === "sabado") {
            rule.weekly = "6";
          } else if (rule.weekly === "domingo") {
            rule.weekly = "0";
          }
        }

        rule.id = (
          Math.floor(Math.random() * 100000) *
          Math.floor(Math.random() * 100000) *
          Math.floor(Math.random() * 100000) *
          Math.floor(Math.random() * 100000)
        ).toString();

        validateRules(readRules, rule)
          .then(() => {
            readRules.push(rule);
            fs.writeFile(DATABASE_RULES, JSON.stringify(readRules), function(err) {
              if (!err) {
                resolve(readRules);
              } else {
                reject("Não foi possível escrever no arquivo");
              }
            });
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

export function validateRules(currentRules: Rule[], rule: Rule) {
  return new Promise((resolve, reject) => {
    if (rule.especific_day) {
      currentRules.forEach(r => {
        if (r.especific_day && r.especific_day === rule.especific_day) {
          let validated = validateIntervals(rule.intervals, r.intervals);
          if (!validated) {
            reject("Existem um ou mais horários agendados para esta data!");
          }
        } else if (r.weekly) {
          let rDayOfWeek = r.weekly;
          let ruleDayOfWeek = moment(rule.especific_day)
            .day()
            .toString();
          if (rDayOfWeek === ruleDayOfWeek) {
            let validated = validateIntervals(rule.intervals, r.intervals);
            if (!validated) {
              reject("Existem um ou mais horários agendados para esta data!");
            }
          }
        } else if (r.daily) {
          let validated = validateIntervals(rule.intervals, r.intervals);
          if (!validated) {
            reject("Existem um ou mais horários agendados para esta data!");
          }
        }
      });
    } else if (rule.weekly) {
      currentRules.forEach(r => {
        if (r.especific_day) {
          let rDayOfWeek = moment(r.especific_day)
            .day()
            .toString();
          let ruleDayOfWeek = rule.weekly;
          if (rDayOfWeek === ruleDayOfWeek) {
            let validated = validateIntervals(rule.intervals, r.intervals);
            if (!validated) {
              reject("Existem um ou mais horários agendados para esta data!");
            }
          }
        } else if (r.weekly) {
          let rDayOfWeek = r.weekly;
          let ruleDayOfWeek = rule.weekly;
          if (rDayOfWeek === ruleDayOfWeek) {
            let validated = validateIntervals(rule.intervals, r.intervals);
            if (!validated) {
              reject("Existem um ou mais horários agendados para esta data!");
            }
          }
        } else if (r.daily) {
          let validated = validateIntervals(rule.intervals, r.intervals);
          if (!validated) {
            reject("Existem um ou mais horários agendados para esta data!");
          }
        }
      });
    } else if (rule.daily) {
      currentRules.forEach(r => {
        let validated = validateIntervals(rule.intervals, r.intervals);
        if (!validated) {
          reject("Existem um ou mais horários agendados para esta data!");
        }
      });
    }
    resolve();
  });
}

function validateIntervals(ruleIntervals: Interval[], rIntervals: Interval[]) {
  let error: boolean = false;
  ruleIntervals.forEach(interval => {
    rIntervals.forEach(rInterval => {
      if ((interval.start >= rInterval.start && interval.start <= rInterval.end) || (rInterval.start >= interval.start && rInterval.start <= interval.end)) {
        error = true;
      }
    });
  });

  if (error) {
    return false;
  } else {
    return true;
  }
}

export function deleteRules(id: string) {
  return new Promise((resolve, reject) => {
    listRules()
      .then(function(rules: Rule[]) {
        let readRules: Rule[] = [];
        rules.forEach(rule => {
          if (rule.id !== id) {
            if (rule.especific_day) {
              rule.especific_day = moment(rule.especific_day, "DD-MM-YYYY").format("YYYY-MM-DD");
            }
            readRules.push(rule);
          }
        });
        fs.writeFile(DATABASE_RULES, JSON.stringify(readRules), function(err) {
          resolve(readRules);
        });
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

export function listRules() {
  return new Promise((resolve, reject) => {
    fs.readFile(DATABASE_RULES, (err: any, rules: any) => {
      if (!err) {
        try {
          let list = JSON.parse(rules).map(rule => {
            if (rule.especific_day) {
              rule.especific_day = moment(rule.especific_day, "YYYY-MM-DD").format("DD-MM-YYYY");
            }
            return rule;
          });
          resolve(list);
        } catch (e) {
          reject({ message: "Não foi possível abrir o DB, mantenha sempre no mínimo um array vazio [] no mesmo." });
        }
      } else {
        reject(err);
      }
    });
  });
}

export function listFilterRules(start: string, end: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(DATABASE_RULES, (err: any, rules: any) => {
      let startAt = moment(start, "DD-MM-YYYY").format("YYYY-MM-DD");
      let endAt = moment(end, "DD-MM-YYYY").format("YYYY-MM-DD");
      if (!err) {
        try {
          let listFilter = [];
          JSON.parse(rules).forEach(rule => {
            if (rule.especific_day) {
              if (rule.especific_day >= startAt && rule.especific_day <= endAt) {
                listFilter.push(rule);
              }
            } else if (rule.weekly !== null) {
              let date = moment(start, "DD-MM-YYYY").format("YYYY-MM-DD");

              let date_temp_init = moment(date).day();
              let ruleDDfWeek = rule.weekly;

              const algo = ruleDDfWeek - date_temp_init + 7;

              date = moment(date)
                .add(algo, "days")
                .format("YYYY-MM-DD");

              while (date <= endAt) {
                if (date >= startAt) {
                  let r = {
                    ...rule
                  };
                  r.weekly = date;
                  listFilter.push(r);
                }
                date = moment(date)
                  .add(7, "days")
                  .format("YYYY-MM-DD");
              }
            } else if (rule.daily) {
              let date = moment(start, "DD-MM-YYYY").format("YYYY-MM-DD");
              while (date <= endAt) {
                if (date >= startAt) {
                  let r = {
                    ...rule
                  };
                  r.daily = date;
                  listFilter.push(r);
                }
                date = moment(date)
                  .add(1, "days")
                  .format("YYYY-MM-DD");
              }
            }
          });
          groupRules(listFilter)
            .then(function(group) {
              formatReturn(group)
                .then(function(formatter) {
                  resolve(formatter);
                })
                .catch(function(err) {
                  reject(err);
                });
            })
            .catch(function(err) {
              reject(err);
            });
        } catch (e) {
          reject({ message: "Não foi possível abrir o DB, mantenha sempre no mínimo um array vazio [] no mesmo." });
        }
      } else {
        reject(err);
      }
    });
  });
}

export function groupRules(rules: any) {
  return new Promise((resolve, reject) => {
    try {
      let listRules = [];
      rules.forEach(rule => {
        const dateRule = rule.especific_day || rule.weekly || rule.daily;
        if (listRules[moment(dateRule).unix()]) {
          let array = listRules[moment(dateRule).unix()];
          array.push(rule);
          listRules[moment(dateRule).unix()] = array;
        } else {
          listRules[moment(dateRule).unix()] = [rule];
        }
      });
      listRules = Object.values(listRules);
      resolve(listRules);
    } catch (err) {
      reject(err);
    }
  });
}

function formatReturn(rules: any) {
  return new Promise((resolve, reject) => {
    try {
      let list = rules.map(rules => {
        let date = null;
        let intervals = [];
        rules.forEach(rule => {
          date = rule.especific_day || rule.weekly || rule.daily;
          rule.intervals.forEach(interval => {
            intervals.push(interval);
          });
        });
        return {
          day: moment(date).format("DD-MM-YYYY"),
          intervals: intervals
        };
      });
      resolve(list);
    } catch (err) {
      reject(err);
    }
  });
}
