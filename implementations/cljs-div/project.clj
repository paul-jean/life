(defproject cljs-div "0.1.0-SNAPSHOT"
  :description "FIXME: write this!"
  :url "http://example.com/FIXME"

  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/clojurescript "0.0-2173"]]

  :plugins [[lein-cljsbuild "1.0.2"]]

  :source-paths ["src"]

  :cljsbuild {
    :builds [{:id "cljs-div"
              :source-paths ["src"]
              :compiler {
                :output-to "cljs_div.js"
                :output-dir "out"
                :optimizations :none
                :source-map true}}]})
