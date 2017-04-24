/**
 * Created by Andrei Bozga on 24-04-17.
 */

const version = 'v1';

self.addEventListener('install', function (event) {
  console.log("SW installed at", new Date().toLocaleTimeString());
  self.skipWaiting();

  event.waitUntil(
    caches.open(version)
      .then(function (cache) {
        return cache.addAll([
          '/app/pages/pages.module.js',
          '/app/theme/theme.module.js',
          '/app/pages/efficiency/efficiency.module.js',
          '/app/pages/acquisition/acquisition.module.js',
          '/app/theme/components/components.module.js',
          '/app/pages/funding/funding.module.js',
          '/app/theme/inputs/inputs.module.js',
          '/app/app.js',
          '/app/theme/theme.config.js',
          '/app/theme/theme.configProvider.js',
          '/app/theme/theme.constants.js',
          '/app/theme/theme.run.js',
          '/app/theme/theme.service.js',
          '/app/pages/efficiency/efficiency.directive.js',
          '/app/pages/efficiency/Efficiency.js',
          '/app/pages/efficiency/EfficiencyCtrl.js',
          '/app/pages/acquisition/acquisition.directive.js',
          '/app/pages/acquisition/Acquisition.js',
          '/app/pages/acquisition/AcquisitionCtrl.js',
          '/app/theme/components/toastrLibConfig.js',
          '/app/pages/funding/funding.directive.js',
          '/app/pages/funding/Funding.js',
          '/app/pages/funding/FundingCtrl.js',
          '/app/theme/directives/animatedChange.js',
          '/app/theme/directives/autoExpand.js',
          '/app/theme/directives/autoFocus.js',
          '/app/theme/directives/includeWithScope.js',
          '/app/theme/directives/ionSlider.js',
          '/app/theme/directives/ngFileSelect.js',
          '/app/theme/directives/scrollPosition.js',
          '/app/theme/directives/trackWidth.js',
          '/app/theme/directives/zoomIn.js',
          '/app/theme/services/baUtil.js',
          '/app/theme/services/fileReader.js',
          '/app/theme/services/preloader.js',
          '/app/theme/services/stopableInterval.js',
          '/app/pages/efficiency/charts/efficiencyCharts.directive.js',
          '/app/pages/efficiency/charts/efficiencyChartsCtrl.js',
          '/app/pages/acquisition/charts/acquisitionCharts.directive.js',
          '/app/pages/acquisition/charts/acquisitionChartsCtrl.js',
          '/app/pages/acquisition/charts/chartJs1DCtrl.js',
          '/app/pages/acquisition/charts/PieChartCtrl.js',
          '/app/theme/components/backTop/backTop.directive.js',
          '/app/theme/components/baPanel/baPanel.directive.js',
          '/app/theme/components/baPanel/baPanel.service.js',
          '/app/theme/components/baPanel/baPanelBlur.directive.js',
          '/app/theme/components/baPanel/baPanelBlurHelper.service.js',
          '/app/theme/components/baPanel/baPanelSelf.directive.js',
          '/app/theme/components/baSidebar/baSidebar.directive.js',
          '/app/theme/components/baSidebar/baSidebar.service.js',
          '/app/theme/components/baSidebar/BaSidebarCtrl.js',
          '/app/theme/components/baSidebar/baSidebarHelpers.directive.js',
          '/app/theme/components/baWizard/baWizard.directive.js',
          '/app/theme/components/baWizard/baWizardCtrl.js',
          '/app/theme/components/baWizard/baWizardStep.directive.js',
          '/app/theme/components/contentTop/contentTop.directive.js',
          '/app/theme/components/pageTop/pageTop.directive.js',
          '/app/theme/components/msgCenter/msgCenter.directive.js',
          '/app/theme/components/msgCenter/MsgCenterCtrl.js',
          '/app/theme/components/widgets/widgets.directive.js',
          '/app/theme/filters/image/appImage.js',
          '/app/theme/filters/image/kameleonImg.js',
          '/app/theme/filters/text/removeHtml.js',
          '/app/theme/inputs/baSwitcher/baSwitcher.js',
          '/app/theme/components/backTop/lib/jquery.backTop.min.js',
          '/app/pages/funding/charts/totalRepayAmount/totalRepayAmountPieChart.directive.js',
          '/app/pages/funding/charts/totalRepayAmount/TotalRepayAmountPieChartCtrl.js',
          '/app/pages/funding/charts/taxLoanAmount/taxLoanAmountPieChart.directive.js',
          '/app/pages/funding/charts/taxLoanAmount/TaxLoanAmountPieChartCtrl.js',
          '/app/pages/funding/funding.html',
          '/app/pages/efficiency/efficiency.html '
        ])
      })
    //return Promise to activate SW
  )
});

self.addEventListener('activate', function (event) {
  console.log("SW activated at", new Date().toLocaleTimeString());
});


self.addEventListener('fetch', function (event) {
  //event.respondWith(fetch(event.request));

  event.respondWith(
    caches.match(event.request)
      .then(function (res) {
        if (res)
          return res;

        if (!navigator.onLine)
          return caches.match(new Request('/Content/offline.html'));

        return fetchAndUpdate(event.request);
      })
  );
/*  if(!navigator.onLine){
    event.respondWith(new Response('<h1> Offline :( </h1>'));
  } else {
    console.log(event.request.url);
    event.respondWith(fetch(event.request));
  }*/

});


function fetchAndUpdate(request) {
  return fetch(request)
    .then(function (res) {
      if (res) {
        return caches.open(version)
          .then(function (cache) {
            return cache.put(request, res.clone())
              .then(function () {
                return res;
              });
          });
      }
    })
}
